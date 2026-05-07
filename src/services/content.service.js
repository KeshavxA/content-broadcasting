

const MOCK_CONTENT = [
  {
    id: 'cnt_01',
    title: 'Advanced Calculus - Week 4',
    description: 'Introduction to differential equations and their applications.',
    status: 'approved',
    createdAt: '2024-05-01T10:00:00Z',
    isLive: false,
    teacherId: 'usr_teacher_01'
  },
  {
    id: 'cnt_02',
    title: 'Linear Algebra Review',
    description: 'Reviewing matrix operations and vector spaces for the upcoming exam.',
    status: 'pending',
    createdAt: '2024-05-05T14:30:00Z',
    isLive: false,
    teacherId: 'usr_teacher_01'
  }
];

export const getMyContent = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return MOCK_CONTENT;
};

/**
 * Create new content for broadcasting
 * @param {object} contentData { title, description }
 */
export const createContent = async (contentData) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const newContent = {
    id: `cnt_0${MOCK_CONTENT.length + 1}`,
    ...contentData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    isLive: false,
    teacherId: 'usr_teacher_01'
  };
  MOCK_CONTENT.push(newContent);
  return newContent;
};

/**
 * Start broadcasting live
 * @param {string} contentId 
 */
export const startLiveBroadcast = async (contentId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const content = MOCK_CONTENT.find(c => c.id === contentId);
  if (content) {
    if (content.status !== 'approved') {
      throw new Error('Content must be approved before broadcasting live.');
    }
    content.isLive = true;
    return content;
  }
  throw new Error('Content not found');
};

/**
 * Stop live broadcast
 * @param {string} contentId 
 */
export const stopLiveBroadcast = async (contentId) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const content = MOCK_CONTENT.find(c => c.id === contentId);
  if (content) {
    content.isLive = false;
    return content;
  }
  throw new Error('Content not found');
};
