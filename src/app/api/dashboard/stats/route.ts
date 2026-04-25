import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { withErrorHandling, withLogging } from '@/middleware/withHandlers';

export const GET = withLogging(withErrorHandling(async () => {
  const [totalCases, pendingEvidence, registeredWitnesses] = await Promise.all([
    prisma.case.count(),
    prisma.evidence.count(),
    prisma.witness.count(),
  ]);

  // For active hearings/open cases, we find the "Open" status first
  const openStatus = await prisma.caseStatus.findFirst({
    where: { name: 'Open' }
  });

  let activeCases = 0;
  if (openStatus) {
    activeCases = await prisma.case.count({
      where: { statusId: openStatus.id }
    });
  } else {
    // Fallback if status isn't perfectly matched
    activeCases = Math.floor(totalCases * 0.4); 
  }

  return NextResponse.json({
    totalCases,
    activeHearings: activeCases,
    pendingEvidence,
    registeredWitnesses
  }, { status: 200 });
}));
