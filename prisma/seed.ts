import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { v4 as uuidv4 } from 'uuid';

async function main() {
  await seedClients();
  await seedUsers();
  await seedTags();
  await seedApplications();
}

const tagRefs = {};
const userRefs = {};
const clientRefs = {};

async function seedClients() {
  const clients = [
    {
      id: 'clp',
      name: 'Colruyt CLP',
    },
    {
      id: 'rpcg',
      name: 'Retail Partners Colruyt Group',
    },
    {
      id: 'kul',
      name: 'KU Leuven',
    },
    {
      id: 'so',
      name: 'Stedelijk Onderwijs',
    },
    {
      id: 'irisnet',
      name: 'IRISnet',
    },
    {
      id: 'earli',
      name: 'Earli',
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
  const users = [
    {
      id: uuidv4(),
      firstName: 'Kris',
      lastName: 'Geens',
      email: 'kris.geens@ausy.be',
    },
    {
      id: uuidv4(),
      firstName: 'Vincent',
      lastName: 'Verhasselt',
      email: 'vincent.verhasselt@ausy.be',
    },
    {
      id: uuidv4(),
      firstName: 'Julie',
      lastName: 'Deneft',
      email: 'Julie.Deneft@ausy.be',
    },
    {
      id: uuidv4(),
      firstName: 'Veronique',
      lastName: 'Van Vlierberge',
      email: 'Veronique.Vanvlierberge@ausy.be',
    },
    {
      id: uuidv4(),
      firstName: 'Wouter',
      lastName: 'Cypers',
      email: 'Wouter.Cypers@ausy.be',
    },
    {
      id: uuidv4(),
      firstName: 'Nelis',
      lastName: 'De Kerpel',
      email: 'Nelis.Dekerpel@ausy.be',
    },
  ];

  users.forEach(async (u) => {
    userRefs[u.email] = u;
  });

  return await prisma.user.createMany({
    data: users,
  });
}

async function seedTags() {
  const applicationTagItems = [
    {
      id: uuidv4(),
      name: 'Backend',
      tags: {
        create: [
          {
            id: uuidv4(),
            name: 'Symfony',
          },
          {
            id: uuidv4(),
            name: 'Laravel',
          },
          {
            id: uuidv4(),
            name: 'Nestjs',
          },
          {
            id: uuidv4(),
            name: 'Drupal 6',
          },
          {
            id: uuidv4(),
            name: 'Drupal 7',
          },
          {
            id: uuidv4(),
            name: 'Drupal 8',
          },
          {
            id: uuidv4(),
            name: 'Drupal 9',
          },
        ],
      },
    },
    {
      id: uuidv4(),
      name: 'Frontend',
      tags: {
        create: [
          {
            id: uuidv4(),
            name: 'VueJs',
          },
          {
            id: uuidv4(),
            name: 'React',
          },
          {
            id: uuidv4(),
            name: 'Svelte',
          },
          {
            id: uuidv4(),
            name: 'AngularJS',
          },
          {
            id: uuidv4(),
            name: 'Angular',
          },
        ],
      },
    },
    {
      id: uuidv4(),
      name: 'Database',
      tags: {
        create: [
          {
            id: uuidv4(),
            name: 'MySQL',
          },
          {
            id: 'redis',
            name: 'Redis',
          },
          {
            id: uuidv4(),
            name: 'MongoDb',
          },
          {
            id: uuidv4(),
            name: 'Elastic',
          },
        ],
      },
    },
    {
      id: uuidv4(),
      name: 'Message Broker',
      tags: {
        create: [
          {
            id: uuidv4(),
            name: 'Apache Kafka',
          },
          {
            id: uuidv4(),
            name: 'RabbitMQ',
          },
        ],
      },
    },
    {
      id: uuidv4(),
      name: 'Cloud',
      tags: {
        create: [
          {
            id: uuidv4(),
            name: 'Amazon AWS',
          },
          {
            id: uuidv4(),
            name: 'Google Cloud',
          },
          {
            id: uuidv4(),
            name: 'Microsoft Azure',
          },
        ],
      },
    },
  ];

  const projectRoleItems = [
    {
      id: uuidv4(),
      name: 'General',
      tags: {
        create: [
          {
            id: uuidv4(),
            name: 'Developer',
          },
          {
            id: uuidv4(),
            name: 'Development Lead',
          },
          {
            id: uuidv4(),
            name: 'Project Manager',
          },
          {
            id: uuidv4(),
            name: 'Solution Architect',
          },
          {
            id: uuidv4(),
            name: 'Analyst',
          },
          {
            id: uuidv4(),
            name: 'Client Contact',
          },
        ],
      },
    },
  ];

  const linkTypeItems = [
    {
      id: 'general',
      name: 'General',
      tags: {
        create: [
          {
            id: 'production_url',
            name: 'Production url',
          },
          {
            id: 'bitbucket_repository',
            name: 'Bitbucket repository',
          },
          {
            id: 'github_repository',
            name: 'Github repository',
          },
          {
            id: 'confluence_page',
            name: 'Confluence page',
          },
        ],
      },
    },
  ];

  const tagGroups = [
    {
      id: 'application_tags',
      name: 'Application tags',
      tagTypes: {
        create: applicationTagItems,
      },
    },
    {
      id: 'project_role_tags',
      name: 'Project role tags',
      tagTypes: {
        create: projectRoleItems,
      },
    },
    {
      id: 'link_type_tags',
      name: 'Link type tags',
      tagTypes: {
        create: linkTypeItems,
      },
    },
  ];

  const promises = [];
  tagGroups.forEach(async (tg) => {
    tg.tagTypes.create.forEach((tt) => {
      tt.tags.create.forEach((t) => {
        tagRefs[t.name] = t;
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
      clientId: clientRefs['clp'].id,
      name: 'CLP Foldertool',
      description: null,
      teamMembers: {
        create: [
          {
            id: uuidv4(),
            userFullName:
              userRefs['kris.geens@ausy.be'].firstName +
              ' ' +
              userRefs['kris.geens@ausy.be'].lastName,
            userId: userRefs['kris.geens@ausy.be'].id,
            tagId: tagRefs['Development Lead'].id,
          },
        ],
      },
      tags: {
        create: [
          {
            id: uuidv4(),
            tagId: tagRefs['Redis'].id,
            value: tagRefs['Redis'].name,
          },
        ],
      },
      links: {
        create: [
          {
            id: uuidv4(),
            tagId: tagRefs['Production url'].id,
            type: 'production_url',
            url: 'https://folderapp.be',
          },
          {
            id: uuidv4(),
            tagId: tagRefs['Bitbucket repository'].id,
            type: 'bitbucket_repository',
            url: 'https://bitbucket.org/ausybenelux/clp-foldertool',
          },
        ],
      },
      notes: {
        create: [
          {
            id: uuidv4(),
            text: 'note 1',
          },
        ],
      },
    },
    {
      id: uuidv4(),
      clientId: clientRefs['rpcg'].id,
      name: 'RPCG Supplier Portal',
      description: null,
    },
    {
      id: uuidv4(),
      clientId: clientRefs['earli'].id,
      name: 'Earli Conference management',
      description: null,
    },
    {
      id: uuidv4(),
      clientId: clientRefs['rpcg'].id,
      name: 'RPCG Margin Simulator',
      description: null,
    },
    {
      id: uuidv4(),
      clientId: clientRefs['so'].id,
      name: 'Stedelijk Onderwijs Antwerpen - Online Inschrijven DKO/VWO',
      description: null,
    },
    {
      id: uuidv4(),
      clientId: clientRefs['so'].id,
      name: 'Stedelijk Onderwijs Antwerpen - Vraag en Meldpunt',
      description: null,
    },
    {
      id: uuidv4(),
      clientId: clientRefs['irisnet'].id,
      name: 'IrisNET - Customer Portal',
      description: null,
    },
    {
      id: uuidv4(),
      clientId: clientRefs['kul'].id,
      name: 'KUlag - Publieke Website',
      description: null,
    },
    {
      id: uuidv4(),
      clientId: clientRefs['kul'].id,
      name: 'KUlag - Screening Applicatie',
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
