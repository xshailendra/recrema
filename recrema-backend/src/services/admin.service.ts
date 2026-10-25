import { CoffeeWasteEntry, ICoffeeWasteEntry } from '../models/CoffeeWasteEntry';
import { AuditLog } from '../models/AuditLog';
import { Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser, User } from '../models/User';

interface AdminWasteQueryFilters {
  status?: string;
  clientId?: string;
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
}

interface PartnerQueryFilters {
  page: number;
  limit: number;
  search?: string;
  active?: boolean;
}

export class AdminService {
  private static partnerProjection = '-passwordHash';

  static async getWasteEntries(filters: AdminWasteQueryFilters) {
    const { status, clientId, startDate, endDate, page, limit } = filters;
    const skip = (page - 1) * limit;
    
    const query: any = {};
    if (status) query.status = status;
    if (clientId && Types.ObjectId.isValid(clientId)) query.clientId = new Types.ObjectId(clientId);
    
    if (startDate || endDate) {
      query.wasteDate = {};
      if (startDate) query.wasteDate.$gte = startDate;
      if (endDate) query.wasteDate.$lte = endDate;
    }

    const [data, total] = await Promise.all([
      CoffeeWasteEntry.find(query)
        .populate('clientId', 'name email clientCode')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      CoffeeWasteEntry.countDocuments(query),
    ]);

    return {
      data,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  static async approveEntry(entryId: string, adminId: string): Promise<ICoffeeWasteEntry> {
    if (!Types.ObjectId.isValid(entryId)) throw new Error('INVALID_ID');

    const entry = await CoffeeWasteEntry.findById(entryId);
    if (!entry) throw new Error('NOT_FOUND');
    if (entry.status !== 'pending') throw new Error('NOT_PENDING');

    entry.status = 'approved';
    entry.approvedBy = new Types.ObjectId(adminId);
    entry.approvedAt = new Date();
    entry.rejectionReason = undefined;

    await entry.save();

    await AuditLog.create({
      action: 'APPROVE_WASTE_ENTRY',
      entityType: 'WASTE_ENTRY',
      entityId: entry._id,
      performedBy: new Types.ObjectId(adminId),
      metadata: { previousStatus: 'pending' },
    });

    return entry;
  }

  static async rejectEntry(entryId: string, adminId: string, reason: string): Promise<ICoffeeWasteEntry> {
    if (!Types.ObjectId.isValid(entryId)) throw new Error('INVALID_ID');

    const entry = await CoffeeWasteEntry.findById(entryId);
    if (!entry) throw new Error('NOT_FOUND');
    if (entry.status !== 'pending') throw new Error('NOT_PENDING');

    entry.status = 'rejected';
    entry.rejectionReason = reason;
    entry.approvedBy = undefined;
    entry.approvedAt = undefined;

    await entry.save();

    await AuditLog.create({
      action: 'REJECT_WASTE_ENTRY',
      entityType: 'WASTE_ENTRY',
      entityId: entry._id,
      performedBy: new Types.ObjectId(adminId),
      metadata: { previousStatus: 'pending', reason },
    });

    return entry;
  }

  static async createPartner(
    data: { name: string; email: string; clientCode: string; password: string },
    adminId: string
  ): Promise<IUser> {
    const email = data.email.toLowerCase();
    const existing = await User.findOne({
      $or: [{ email }, { clientCode: data.clientCode }],
    }).select('_id email clientCode');

    if (existing) {
      if (existing.email === email) throw new Error('DUPLICATE_EMAIL');
      throw new Error('DUPLICATE_CLIENT_CODE');
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    let partner: IUser;
    try {
      partner = await User.create({
        name: data.name,
        email,
        clientCode: data.clientCode,
        passwordHash,
        role: 'client',
        isActive: true,
      });
    } catch (error) {
      if (this.isDuplicateKeyError(error)) {
        throw new Error(this.duplicateKeyField(error) === 'email' ? 'DUPLICATE_EMAIL' : 'DUPLICATE_CLIENT_CODE');
      }
      throw error;
    }

    await AuditLog.create({
      action: 'CREATE_PARTNER',
      entityType: 'USER',
      entityId: partner._id,
      performedBy: new Types.ObjectId(adminId),
    });

    return partner;
  }

  static async getPartners(filters: PartnerQueryFilters) {
    const { page, limit, search, active } = filters;
    const query: {
      role: 'client';
      isActive?: boolean;
      $or?: Array<Record<string, RegExp>>;
    } = { role: 'client' };
    if (active !== undefined) query.isActive = active;
    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedSearch, 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { clientCode: searchRegex }];
    }

    const [data, total] = await Promise.all([
      User.find(query)
        .select(this.partnerProjection)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      User.countDocuments(query),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  static async getPartner(partnerId: string): Promise<IUser> {
    const partner = await this.findPartner(partnerId);
    if (!partner) throw new Error('NOT_FOUND');
    return partner;
  }

  static async updatePartnerStatus(partnerId: string, isActive: boolean, adminId: string): Promise<IUser> {
    const partner = await this.findPartner(partnerId);
    if (!partner) throw new Error('NOT_FOUND');

    partner.isActive = isActive;
    await partner.save();
    await AuditLog.create({
      action: isActive ? 'ACTIVATE_PARTNER' : 'DEACTIVATE_PARTNER',
      entityType: 'USER',
      entityId: partner._id,
      performedBy: new Types.ObjectId(adminId),
    });
    return partner;
  }

  static async resetPartnerPassword(partnerId: string, password: string, adminId: string): Promise<void> {
    if (!Types.ObjectId.isValid(partnerId)) throw new Error('INVALID_ID');
    const partner = await User.findOne({ _id: partnerId, role: 'client' });
    if (!partner) throw new Error('NOT_FOUND');

    partner.passwordHash = await bcrypt.hash(password, 10);
    await partner.save();
    await AuditLog.create({
      action: 'RESET_PARTNER_PASSWORD',
      entityType: 'USER',
      entityId: partner._id,
      performedBy: new Types.ObjectId(adminId),
    });
  }

  private static async findPartner(partnerId: string): Promise<IUser | null> {
    if (!Types.ObjectId.isValid(partnerId)) throw new Error('INVALID_ID');
    return User.findOne({ _id: partnerId, role: 'client' }).select(this.partnerProjection);
  }

  private static isDuplicateKeyError(error: unknown): error is { code: number; keyPattern?: Record<string, unknown> } {
    return typeof error === 'object' && error !== null && 'code' in error && error.code === 11000;
  }

  private static duplicateKeyField(error: { keyPattern?: Record<string, unknown> }): string | undefined {
    return error.keyPattern ? Object.keys(error.keyPattern)[0] : undefined;
  }
}
