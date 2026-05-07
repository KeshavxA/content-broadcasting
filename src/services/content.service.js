
const MOCK_CONTENT = [
  {
    id: 'cnt_01',
    title: 'Advanced Calculus - Week 4',
    description: 'Introduction to differential equations and their applications.',
    status: 'approved',
    createdAt: '2024-05-01T10:00:00Z',
    isLive: false,
    teacherId: 'usr_teacher_01',
    teacherName: 'Prof. Alexander Wright'
  },
  {
    id: 'cnt_02',
    title: 'Linear Algebra Review',
    description: 'Reviewing matrix operations and vector spaces for the upcoming exam.',
    status: 'pending',
    createdAt: '2024-05-05T14:30:00Z',
    isLive: false,
    teacherId: 'usr_teacher_01',
    teacherName: 'Prof. Alexander Wright'
  },
  {
    id: 'cnt_03',
    title: 'Organic Chemistry II',
    description: 'Special session on reaction mechanisms.',
    status: 'approved',
    createdAt: '2024-05-06T09:15:00Z',
    isLive: true,
    teacherId: 'usr_teacher_02',
    teacherName: 'Dr. Emily Brooks'
  }
];

export const upload = async (contentData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newContent = {
    id: `cnt_${Math.random().toString(36).substr(2, 9)}`,
    ...contentData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    isLive: false,
    teacherId: 'usr_teacher_01',
    teacherName: 'Prof. Alexander Wright'
  };
  MOCK_CONTENT.push(newContent);
  return newContent;
};

export const getMyContent = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return MOCK_CONTENT.filter(c => c.teacherId === 'usr_teacher_01');
};

export const getAll = async () => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return MOCK_CONTENT;
};

export const getActive = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_CONTENT.filter(c => c.isLive === true);
};
