import prisma from '@/lib/prisma';
import { Case, Prisma } from '@prisma/client';

// Define a type for the raw data coming from the form/API
interface CaseCreateData {
  title: string;
  status: string;
  date: string; // The date is a string from the form
  userId: string;
  description?: string;
}

export const CaseService = {
  async list(): Promise<any[]> {
    const cases = await prisma.case.findMany({
      include: {
        status: true
      }
    });
    // Map the relational status back to a simple string for the frontend
    return cases.map(c => ({
      ...c,
      status: c.status?.name || 'Open'
    }));
  },

  async get(id: string): Promise<Case | null> {
    return prisma.case.findUnique({ where: { id } });
  },

  // FIX: Update the 'create' function's signature and logic
  async create(data: CaseCreateData): Promise<Case> {
    console.log('  TRACE: CaseService.create - Transforming data');

    let caseStatusObj = await prisma.caseStatus.findFirst({ where: { name: data.status } });
    if (!caseStatusObj) {
        caseStatusObj = await prisma.caseStatus.create({ data: { name: data.status || 'Open' } });
    }

    // Transform the raw data into the format Prisma expects
    const prismaData: Prisma.CaseCreateInput = {
      title: data.title,
      status: { connect: { id: caseStatusObj.id } },
      date: new Date(data.date), // Convert the date string to a Date object
      description: data.description,
      user: { // Use the 'connect' syntax for the relation
        connect: {
          id: data.userId
        }
      }
    };

    console.log('  TRACE: CaseService.create - Executing Prisma prisma.case.create');
    // Pass the correctly formatted data to Prisma
    const result = await prisma.case.create({ data: prismaData });
    console.log('  TRACE: CaseService.create - Prisma result received');
    return result;
  },

  async update(id: string, data: Prisma.CaseUpdateInput): Promise<Case | null> {
    // Note: You will need a similar transformation here if you update cases
    return prisma.case.update({ where: { id }, data });
  },

  async remove(id: string): Promise<Case | null> {
    return prisma.case.delete({ where: { id } });
  },
};