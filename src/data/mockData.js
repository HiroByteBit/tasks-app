import { subDays, addDays } from 'date-fns'

const now = new Date()

export const workspace = {
  name: "Acme Corp",
  plan: "Pro",
  members: [
    { id: 'u1', name: 'Alice', email: 'alice@acme.com', role: 'admin', avatar: 'A' },
    { id: 'u2', name: 'Bob', email: 'bob@acme.com', role: 'member', avatar: 'B' },
    { id: 'u3', name: 'Charlie', email: 'charlie@acme.com', role: 'member', avatar: 'C' },
    { id: 'u4', name: 'Diana', email: 'diana@acme.com', role: 'member', avatar: 'D' },
    { id: 'u5', name: 'Eve', email: 'eve@acme.com', role: 'member', avatar: 'E' },
    { id: 'u6', name: 'Frank', email: 'frank@acme.com', role: 'member', avatar: 'F' },
  ]
}

export const projects = [
  { id: 'p1', name: 'Website Redesign', emoji: '🌐', color: '#3b82f6', description: 'Redesign main site', progress: 40, dueDate: addDays(now, 10), status: 'active' },
  { id: 'p2', name: 'Mobile App', emoji: '📱', color: '#8b5cf6', description: 'React Native app', progress: 80, dueDate: addDays(now, 20), status: 'active' },
  { id: 'p3', name: 'API v2', emoji: '⚡', color: '#10b981', description: 'GraphQL rewrite', progress: 10, dueDate: addDays(now, 30), status: 'planning' },
  { id: 'p4', name: 'Marketing Q1', emoji: '📊', color: '#f59e0b', description: 'Q1 campaigns', progress: 60, dueDate: addDays(now, 5), status: 'active' },
]

export const teams = ['Engineering', 'Design', 'Marketing']

export const labels = [
  { id: 'l1', name: 'Bug', color: '#ef4444' },
  { id: 'l2', name: 'Feature', color: '#3b82f6' },
  { id: 'l3', name: 'Enhancement', color: '#10b981' },
  { id: 'l4', name: 'Design', color: '#d946ef' },
  { id: 'l5', name: 'Backend', color: '#6366f1' },
  { id: 'l6', name: 'Frontend', color: '#0ea5e9' },
  { id: 'l7', name: 'Docs', color: '#8b5cf6' },
  { id: 'l8', name: 'Testing', color: '#f59e0b' },
]

// Generate 40 tasks
export const tasks = []
const statuses = ['todo', 'in_progress', 'in_review', 'done', 'cancelled']
const priorities = ['urgent', 'high', 'medium', 'low', 'none']
const estimates = ['1d', '3d', '1w', '2w', null]

let taskCounter = 1;
const createTask = (status, priority, projectIdx, hasSub = false, hasComments = false) => {
  const id = `t${taskCounter++}`;
  const t = {
    id,
    title: `Task ${id} - Implement something`,
    description: `This is a sample description for ${id}. Needs to be detailed.`,
    status,
    priority,
    assignee: workspace.members[taskCounter % workspace.members.length],
    labels: [labels[taskCounter % labels.length]],
    dueDate: addDays(now, (taskCounter % 14) - 7).toISOString(),
    estimate: estimates[taskCounter % estimates.length],
    project: projects[projectIdx % projects.length],
    parentId: null,
    subTasks: [],
    comments: [],
    attachments: [],
    createdAt: subDays(now, 5).toISOString(),
    updatedAt: subDays(now, 1).toISOString(),
    order: taskCounter
  };

  if (hasSub) {
    const s1 = createTask('todo', 'none', projectIdx);
    s1.parentId = id;
    const s2 = createTask('done', 'none', projectIdx);
    s2.parentId = id;
    t.subTasks = [s1.id, s2.id];
    tasks.push(s1, s2);
  }

  if (hasComments) {
    t.comments = [
      { id: `c${id}1`, author: workspace.members[0], text: "Looks good so far", createdAt: subDays(now, 1).toISOString() },
      { id: `c${id}2`, author: workspace.members[1], text: "I found an edge case.", createdAt: now.toISOString() },
    ]
  }

  return t;
}

// 12 todo, 10 in_progress, 8 in_review, 8 done, 2 cancelled
for (let i = 0; i < 12; i++) tasks.push(createTask('todo', priorities[i%5], i, i < 1, i < 1));
for (let i = 0; i < 10; i++) tasks.push(createTask('in_progress', priorities[i%5], i, i < 1, i < 1));
for (let i = 0; i < 8; i++) tasks.push(createTask('in_review', priorities[i%5], i, i < 1, i < 1));
for (let i = 0; i < 8; i++) tasks.push(createTask('done', priorities[i%5], i, false, i < 1));
for (let i = 0; i < 2; i++) tasks.push(createTask('cancelled', 'none', i));

export const notifications = [
  { id: 'n1', type: 'mention', actor: workspace.members[0], task: tasks[0], read: false, createdAt: now.toISOString() },
  { id: 'n2', type: 'assignment', actor: workspace.members[1], task: tasks[1], read: false, createdAt: subDays(now, 1).toISOString() },
  { id: 'n3', type: 'update', actor: workspace.members[2], task: tasks[2], read: false, createdAt: subDays(now, 2).toISOString() },
  { id: 'n4', type: 'mention', actor: workspace.members[0], task: tasks[3], read: false, createdAt: subDays(now, 3).toISOString() },
  { id: 'n5', type: 'assignment', actor: workspace.members[1], task: tasks[4], read: false, createdAt: subDays(now, 4).toISOString() },
  { id: 'n6', type: 'update', actor: workspace.members[2], task: tasks[5], read: false, createdAt: subDays(now, 5).toISOString() },
  { id: 'n7', type: 'mention', actor: workspace.members[0], task: tasks[6], read: false, createdAt: subDays(now, 6).toISOString() },
  { id: 'n8', type: 'assignment', actor: workspace.members[1], task: tasks[7], read: false, createdAt: subDays(now, 7).toISOString() },
]
