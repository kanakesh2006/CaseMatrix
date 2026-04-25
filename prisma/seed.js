const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
	console.log('Seeding database with Normalized relational model (5+ rows per table)...');

	// Helper for statuses (5 rows)
	const statusOpen = await prisma.caseStatus.create({ data: { name: 'Open' } });
	const statusClosed = await prisma.caseStatus.create({ data: { name: 'Closed' } });
	const statusInProgress = await prisma.caseStatus.create({ data: { name: 'In Progress' } });
	const statusAppealed = await prisma.caseStatus.create({ data: { name: 'Appealed' } });
	const statusPending = await prisma.caseStatus.create({ data: { name: 'Pending Review' } });

	// Helper for types (5 rows)
	const docType = await prisma.evidenceType.create({ data: { name: 'Document' } });
	const videoType = await prisma.evidenceType.create({ data: { name: 'Video' } });
	const audioType = await prisma.evidenceType.create({ data: { name: 'Audio' } });
	const photoType = await prisma.evidenceType.create({ data: { name: 'Photograph' } });
	const physicalType = await prisma.evidenceType.create({ data: { name: 'Physical Object' } });

	// 5 Users (5 Lawyers!)
	const user1 = await prisma.user.create({
		data: { email: 'client1@example.com', passwordHash: 'pwd', role: 'user' }
	});
	const user2 = await prisma.user.create({
		data: { email: 'client2@example.com', passwordHash: 'pwd', role: 'user' }
	});
	const lawyer1 = await prisma.user.create({
		data: { 
            email: 'lawyer1@example.com', passwordHash: 'pwd', role: 'lawyer',
            lawyer: { create: { specialization: 'criminal' } }
        }
	});
	const lawyer2 = await prisma.user.create({
		data: { 
            email: 'lawyer2@example.com', passwordHash: 'pwd', role: 'lawyer',
            lawyer: { create: { specialization: 'corporate' } }
        }
	});
	const lawyer3 = await prisma.user.create({
		data: { 
            email: 'lawyer3@example.com', passwordHash: 'pwd', role: 'lawyer',
            lawyer: { create: { specialization: 'family' } }
        }
	});
	const lawyer4 = await prisma.user.create({
		data: { 
            email: 'lawyer4@example.com', passwordHash: 'pwd', role: 'lawyer',
            lawyer: { create: { specialization: 'patent' } }
        }
	});
	const lawyer5 = await prisma.user.create({
		data: { 
            email: 'lawyer5@example.com', passwordHash: 'pwd', role: 'lawyer',
            lawyer: { create: { specialization: 'real estate' } }
        }
	});

	// 5 Cases
	const case1 = await prisma.case.create({
		data: { title: 'Case One', date: new Date(), description: 'First case', userId: user1.id, lawyerId: lawyer1.id, statusId: statusOpen.id }
	});
	const case2 = await prisma.case.create({
		data: { title: 'Case Two', date: new Date(), description: 'Second case', userId: user2.id, lawyerId: lawyer2.id, statusId: statusInProgress.id }
	});
	const case3 = await prisma.case.create({
		data: { title: 'Case Three', date: new Date(), description: 'Third case', userId: user1.id, lawyerId: lawyer3.id, statusId: statusClosed.id }
	});
	const case4 = await prisma.case.create({
		data: { title: 'Case Four', date: new Date(), description: 'Fourth case', userId: user2.id, lawyerId: lawyer4.id, statusId: statusAppealed.id }
	});
	const case5 = await prisma.case.create({
		data: { title: 'Case Five', date: new Date(), description: 'Fifth case', userId: user1.id, lawyerId: lawyer5.id, statusId: statusPending.id }
	});

	// 5 Evidence items
	await prisma.evidence.createMany({
		data: [
			{ caseId: case1.id, name: 'Evid 1', typeId: docType.id, uploaded: new Date() },
			{ caseId: case2.id, name: 'Evid 2', typeId: videoType.id, uploaded: new Date() },
			{ caseId: case3.id, name: 'Evid 3', typeId: audioType.id, uploaded: new Date() },
			{ caseId: case4.id, name: 'Evid 4', typeId: photoType.id, uploaded: new Date() },
			{ caseId: case5.id, name: 'Evid 5', typeId: physicalType.id, uploaded: new Date() },
		]
	});

	// 5 Witness lines
	await prisma.witness.createMany({
		data: [
			{ caseId: case1.id, name: 'Wit 1', statement: 'Statement One' },
			{ caseId: case2.id, name: 'Wit 2', statement: 'Statement Two' },
			{ caseId: case3.id, name: 'Wit 3', statement: 'Statement Three' },
			{ caseId: case4.id, name: 'Wit 4', statement: 'Statement Four' },
			{ caseId: case5.id, name: 'Wit 5', statement: 'Statement Five' },
		]
	});

	console.log('Seeding completed successfully.');
}

main()
	.then(async () => { await prisma.$disconnect(); })
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});
