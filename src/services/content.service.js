
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

const generateMockData = () => {
  const data = [...MOCK_CONTENT];
  const statuses = ['approved', 'pending', 'rejected'];
  const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "History", "Geography", "English", "Computer Science"];

  for (let i = 1; i <= 500; i++) {
    data.push({
      id: `cnt_gen_${i}`,
      title: `Generated Lesson #${i} - ${subjects[i % subjects.length]}`,
      description: `This is an automated mock description for lesson number ${i}. It covers various topics in ${subjects[i % subjects.length]}.`,
      status: statuses[i % statuses.length],
      createdAt: new Date(Date.now() - i * 3600000).toISOString(),
      isLive: i % 20 === 0,
      teacherId: `usr_teacher_${i % 10}`,
      teacherName: `Teacher ${i % 10 + 1}`,
      subject: subjects[i % subjects.length],
      startTime: new Date(Date.now() + i * 3600000).toISOString(),
      endTime: new Date(Date.now() + (i + 1) * 3600000).toISOString(),
    });
  }
  return data;
};

const LARGE_MOCK_DATA = generateMockData();

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
  LARGE_MOCK_DATA.push(newContent);
  return newContent;
};

export const getMyContent = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return LARGE_MOCK_DATA.filter(c => c.teacherId === 'usr_teacher_01');
};

export const getAll = async () => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return LARGE_MOCK_DATA;
};

export const getActive = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return LARGE_MOCK_DATA.filter(c => c.isLive === true);
};

export const getActiveByTeacher = async (teacherId) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return LARGE_MOCK_DATA.find(c => c.teacherId === teacherId && c.isLive === true);
};
