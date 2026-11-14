import { CoffeeWasteEntry, ICoffeeWasteEntry } from '../models/CoffeeWasteEntry';
import { Types } from 'mongoose';

export class WasteService {
  static async createEntry(
    clientId: string,
    data: { quantityKg: number; wasteDate: Date; notes?: string }
  ): Promise<ICoffeeWasteEntry> {
    const entry = new CoffeeWasteEntry({
      ...data,
      clientId: new Types.ObjectId(clientId),
      status: 'pending', // Force pending
    });

    return await entry.save();
  }

  static async getClientEntries(clientId: string, page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    const query = { clientId: new Types.ObjectId(clientId) };

    const [data, total] = await Promise.all([
      CoffeeWasteEntry.find(query)
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

  static async getClientApprovedSummary(clientId: string) {
    const [result] = await CoffeeWasteEntry.aggregate([
      { $match: { clientId: new Types.ObjectId(clientId), status: 'approved' } },
      { $group: { _id: null, approvedKg: { $sum: '$quantityKg' }, approvedEntries: { $sum: 1 } } },
      { $project: { _id: 0, approvedKg: 1, approvedEntries: 1 } },
    ]);

    return result ?? { approvedKg: 0, approvedEntries: 0 };
  }

  static async getClientEntryById(clientId: string, entryId: string): Promise<ICoffeeWasteEntry | null> {
    if (!Types.ObjectId.isValid(entryId)) {
      return null;
    }

    return await CoffeeWasteEntry.findOne({
      _id: new Types.ObjectId(entryId),
      clientId: new Types.ObjectId(clientId),
    });
  }
}
