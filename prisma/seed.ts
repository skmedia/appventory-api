import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { v4 as uuidv4 } from 'uuid';
import slugify from 'slugify';
import { cloneDeep } from 'lodash';
import { hash } from 'bcrypt';

async function main() {
  console.log('seedAccounts');
  await seedAccounts();

  console.log('seedClients');
  await seedClients();

  console.log('seedUsers');
  await seedUsers();

  console.log('seedTags');
  await seedTags();

  console.log('seedApplications');
  await seedApplications();
}

const accountRefs = {};
const tagRefs = {};
const userRefs = {};
const clientRefs = {};

async function seedAccounts() {
  const accounts = [
    {
      id: 'account_1',
      name: 'Account 1',
    },
    {
      id: 'account_2',
      name: 'Account 2',
    },
  ];

  accounts.forEach(async (c) => {
    accountRefs[c.id] = c;
  });

  return await prisma.account.createMany({
    data: accounts,
  });
}

async function seedClients() {
  const clients = [
    {
      id: 'client_1',
      accountId: 'account_1',
      name: 'Client 1',
    },
    {
      id: 'client_2',
      accountId: 'account_1',
      name: 'Client 2',
    },
    {
      id: 'client_3',
      accountId: 'account_2',
      name: 'Client 3',
    },
  ];

  clients.forEach(async (c) => {
    clientRefs[c.id] = c;
  });

  return await prisma.client.createMany({
    data: clients,
  });
}

async function seedUsers() {
  const users: any = [
    {
      id: uuidv4(),
      accountId: accountRefs['account_1'].id,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'admin',
    },
    {
      id: uuidv4(),
      accountId: accountRefs['account_1'].id,
      firstName: 'Bob',
      lastName: 'Doe',
      email: 'bob.doe@example.com',
      role: 'user',
    },
    {
      id: uuidv4(),
      accountId: accountRefs['account_2'].id,
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      role: 'admin',
    },
    {
      id: uuidv4(),
      accountId: accountRefs['account_2'].id,
      firstName: 'Mike',
      lastName: 'Doe',
      email: 'mike.doe@example.com',
      role: 'user',
    },
  ];

  for (const u of users) {
    const pass = await hash(u.email, 10);
    u.password = pass;
  }

  const promises = [];
  users.forEach(async (u: any) => {
    userRefs[u.email] = u;
    promises.push(prisma.user.create({ data: u }));
  });

  return await Promise.all(promises);
}

async function seedTags() {
  const applicationTagItems = [
    {
      label: 'Backend',
      tags: {
        create: [
          {
            label: 'Symfony',
          },
          {
            label: 'Laravel',
          },
          {
            label: 'Nestjs',
          },
          {
            label: 'Drupal 6',
          },
          {
            label: 'Drupal 7',
          },
          {
            label: 'Drupal 8',
          },
          {
            label: 'Drupal 9',
          },
        ],
      },
    },
    {
      label: 'Frontend',
      tags: {
        create: [
          {
            label: 'VueJs',
          },
          {
            label: 'React',
          },
          {
            label: 'Svelte',
          },
          {
            label: 'AngularJS',
          },
          {
            label: 'Angular',
          },
        ],
      },
    },
    {
      label: 'Database',
      tags: {
        create: [
          {
            label: 'MySQL',
          },
          {
            label: 'Redis',
          },
          {
            label: 'MongoDb',
          },
          {
            label: 'Elastic',
          },
        ],
      },
    },
    {
      label: 'Message Broker',
      tags: {
        create: [
          {
            label: 'Apache Kafka',
          },
          {
            label: 'RabbitMQ',
          },
        ],
      },
    },
    {
      label: 'Cloud',
      tags: {
        create: [
          {
            label: 'Amazon AWS',
          },
          {
            label: 'Google Cloud',
          },
          {
            label: 'Microsoft Azure',
          },
        ],
      },
    },
  ];

  const projectRoleItems = [
    {
      label: 'General',
      tags: {
        create: [
          {
            label: 'Developer',
          },
          {
            label: 'Development Lead',
          },
          {
            label: 'Project Manager',
          },
          {
            label: 'Solution Architect',
          },
          {
            label: 'Analyst',
          },
          {
            label: 'Client Contact',
          },
        ],
      },
    },
  ];

  const linkTypeItems = [
    {
      label: 'General',
      tags: {
        create: [
          {
            label: 'Production url',
          },
          {
            label: 'Bitbucket repository',
          },
          {
            label: 'Github repository',
          },
          {
            label: 'Confluence page',
          },
        ],
      },
    },
  ];

  const noteTypeItems = [
    {
      label: 'General',
      tags: {
        create: [
          {
            label: 'General',
          },
        ],
      },
    },
  ];

  const tagGroupsAccount1 = [
    {
      accountId: accountRefs['account_1'].id,
      label: 'Application tags',
      tagTypes: {
        create: cloneDeep(applicationTagItems),
      },
    },
    {
      accountId: accountRefs['account_1'].id,
      label: 'Project role tags',
      tagTypes: {
        create: cloneDeep(projectRoleItems),
      },
    },
    {
      accountId: accountRefs['account_1'].id,
      label: 'Link type tags',
      tagTypes: {
        create: cloneDeep(linkTypeItems),
      },
    },
    {
      accountId: accountRefs['account_1'].id,
      label: 'Note type tags',
      tagTypes: {
        create: cloneDeep(noteTypeItems),
      },
    },
  ];

  const tagGroupsAccount2 = [
    {
      accountId: accountRefs['account_2'].id,
      label: 'Application tags',
      tagTypes: {
        create: cloneDeep(applicationTagItems),
      },
    },
    {
      accountId: accountRefs['account_2'].id,
      label: 'Project role tags',
      tagTypes: {
        create: cloneDeep(projectRoleItems),
      },
    },
    {
      accountId: accountRefs['account_2'].id,
      label: 'Link type tags',
      tagTypes: {
        create: cloneDeep(linkTypeItems),
      },
    },
    {
      accountId: accountRefs['account_2'].id,
      label: 'Note type tags',
      tagTypes: {
        create: cloneDeep(noteTypeItems),
      },
    },
  ];

  const promises = [];

  tagGroupsAccount2.forEach(async (tg: any) => {
    tg.id = uuidv4();
    tg.code = slugify(tg.label, { lower: true });
    tg.tagTypes.create.forEach((tt: any) => {
      tt.id = uuidv4();
      tt.code = slugify(tt.label, { lower: true });
      tt.tags.create.forEach((t) => {
        t.id = uuidv4();
        t.code = slugify(t.label, { lower: true });
        tagRefs[tg.accountId + '-' + t.code] = t;
      });
    });
    promises.push(
      prisma.tagGroup.create({
        data: tg,
      }),
    );
  });

  tagGroupsAccount1.forEach(async (tg: any) => {
    tg.id = uuidv4();
    tg.code = slugify(tg.label, { lower: true });
    tg.tagTypes.create.forEach((tt: any) => {
      tt.id = uuidv4();
      tt.code = slugify(tt.label, { lower: true });
      tt.tags.create.forEach((t) => {
        t.id = uuidv4();
        t.code = slugify(t.label, { lower: true });
        tagRefs[tg.accountId + '-' + t.code] = t;
      });
    });
    promises.push(
      prisma.tagGroup.create({
        data: tg,
      }),
    );
  });

  return await Promise.all(promises);
}

async function seedApplications() {
  const applications: any[] = [
    {
      id: uuidv4(),
      accountId: accountRefs['account_1'].id,
      clientId: clientRefs['client_1'].id,
      name: 'Application 1',
      description: null,
      teamMembers: {
        create: [
          {
            id: uuidv4(),
            userFullName:
              userRefs['john.doe@example.com'].firstName +
              ' ' +
              userRefs['john.doe@example.com'].lastName,
            userId: userRefs['john.doe@example.com'].id,
            tagId: tagRefs['account_1-development-lead'].id,
          },
        ],
      },
      tags: {
        create: [
          {
            id: uuidv4(),
            tagId: tagRefs['account_1-redis'].id,
            label: tagRefs['account_1-redis'].label,
          },
        ],
      },
      links: {
        create: [
          {
            id: uuidv4(),
            tagId: tagRefs['account_1-production-url'].id,
            type: 'production_url',
            url: 'https://production_url.com',
          },
          {
            id: uuidv4(),
            tagId: tagRefs['account_1-bitbucket-repository'].id,
            type: 'bitbucket_repository',
            url: 'https://bitbucket.org/company/repo',
          },
        ],
      },
      notes: {
        create: [
          {
            id: uuidv4(),
            tagId: tagRefs['account_1-general'].id,
            text: 'note 1',
          },
        ],
      },
    },
    {
      id: uuidv4(),
      accountId: accountRefs['account_1'].id,
      clientId: clientRefs['client_1'].id,
      name: 'Application 2',
      description: null,
    },
    {
      id: uuidv4(),
      accountId: accountRefs['account_1'].id,
      clientId: clientRefs['client_1'].id,
      name: 'Application 3',
      description: null,
    },
    {
      id: uuidv4(),
      accountId: accountRefs['account_2'].id,
      clientId: clientRefs['client_3'].id,
      name: 'Application 4',
      description: null,
    },
  ];

  const promises = [];
  applications.forEach((app) => {
    promises.push(
      prisma.application.create({
        data: app,
      }),
    );
  });

  return await Promise.all(promises);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
