import { CoffeeWasteEntry } from '../models/CoffeeWasteEntry';
import { PipelineStage } from 'mongoose';

interface InsightsFilters {
  startDate?: Date;
  endDate?: Date;
  year?: number;
  month?: string; // YYYY-MM
}

export class InsightsService {
  static buildDateMatch(filters: InsightsFilters) {
    const matchQuery: any = { status: 'approved' };
    
    let gte: Date | undefined;
    let lte: Date | undefined;

    if (filters.startDate) gte = filters.startDate;
    
    if (filters.endDate) {
      // Treat endDate as inclusive of the entire day by setting to end of day if time is 00:00:00
      lte = new Date(filters.endDate);
      if (lte.getUTCHours() === 0 && lte.getUTCMinutes() === 0 && lte.getUTCSeconds() === 0) {
        lte.setUTCHours(23, 59, 59, 999);
      }
    }

    if (filters.year) {
      gte = new Date(Date.UTC(filters.year, 0, 1));
      lte = new Date(Date.UTC(filters.year, 11, 31, 23, 59, 59, 999));
    }

    if (filters.month) {
      const [y, m] = filters.month.split('-');
      const yearNum = parseInt(y, 10);
      const monthNum = parseInt(m, 10) - 1; // 0-indexed
      gte = new Date(Date.UTC(yearNum, monthNum, 1));
      // End of month
      lte = new Date(Date.UTC(yearNum, monthNum + 1, 0, 23, 59, 59, 999));
    }

    if (gte || lte) {
      matchQuery.wasteDate = {};
      if (gte) matchQuery.wasteDate.$gte = gte;
      if (lte) matchQuery.wasteDate.$lte = lte;
    }

    return matchQuery;
  }

  static async getSummary(filters: InsightsFilters) {
    const match = this.buildDateMatch(filters);

    const pipeline: PipelineStage[] = [
      { $match: match },
      {
        $group: {
          _id: null,
          totalWasteKg: { $sum: '$quantityKg' },
          uniqueClients: { $addToSet: '$clientId' },
          approvedEntries: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          totalWasteKg: 1,
          contributingClients: { $size: '$uniqueClients' },
          approvedEntries: 1,
        },
      },
    ];

    const result = await CoffeeWasteEntry.aggregate(pipeline);

    if (result.length === 0) {
      return {
        totalWasteKg: 0,
        contributingClients: 0,
        approvedEntries: 0,
      };
    }

    return result[0];
  }

  static async getTrends(period: 'monthly' | 'yearly') {
    const format = period === 'monthly' ? '%Y-%m' : '%Y';

    const pipeline: PipelineStage[] = [
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: { $dateToString: { format, date: '$wasteDate' } },
          totalWasteKg: { $sum: '$quantityKg' },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          period: '$_id',
          totalWasteKg: 1,
        },
      },
    ];

    return await CoffeeWasteEntry.aggregate(pipeline);
  }

  static async getContributors(limit: number) {
    const pipeline: PipelineStage[] = [
      { $match: { status: 'approved' } },
      {
        $group: {
          _id: '$clientId',
          totalWasteKg: { $sum: '$quantityKg' },
        },
      },
      { $sort: { totalWasteKg: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'clientDetails',
        },
      },
      {
        $unwind: '$clientDetails',
      },
      {
        $project: {
          _id: 0,
          clientId: '$_id',
          clientName: '$clientDetails.name',
          totalWasteKg: 1,
        },
      },
    ];

    return await CoffeeWasteEntry.aggregate(pipeline);
  }
}
