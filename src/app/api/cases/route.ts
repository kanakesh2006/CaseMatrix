import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling, withLogging } from '@/middleware/withHandlers';
import { withAuth } from '@/middleware/auth';
import { CaseService } from '@/services/case.service';
import { validateCase } from '@/utils/validation';

export const GET = withLogging(withErrorHandling(async () => {
  return NextResponse.json(await CaseService.list(), { status: 200 });
}));

export const POST = withLogging(withErrorHandling(withAuth(async (req: NextRequest) => {
  console.log('--- TRACE: START Case Creation ---');
  const body = await req.json();
  console.log('TRACE: Received body:', JSON.stringify(body, null, 2));
  
  const errors = validateCase(body);
  if (errors.length) {
    console.log('TRACE: Validation errors:', errors);
    return NextResponse.json({ errors }, { status: 400 });
  }

  console.log('TRACE: Calling CaseService.create');
  const created = await CaseService.create(body);
  console.log('TRACE: Case created successfully:', JSON.stringify(created, null, 2));
  console.log('--- TRACE: END Case Creation ---');
  
  return NextResponse.json(created, { status: 201 });
})));


