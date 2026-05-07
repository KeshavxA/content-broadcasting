
const MOCK_PENDING = [
  {
    id: 'cnt_02',
    title: 'Linear Algebra Review',
    description: 'Reviewing matrix operations and vector spaces for the upcoming exam.',
    teacherName: 'Prof. Alexander Wright',
    teacherId: 'usr_teacher_01',
    requestedAt: '2024-05-05T14:30:00Z',
    status: 'pending'
  }
];

export const getPending = async () => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return MOCK_PENDING;
};

/**
 * Approve a content request
 * @param {string} id - Content ID 
 */
export const approve = async (id) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const index = MOCK_PENDING.findIndex(r => r.id === id);
  if (index !== -1) {
    const approvedItem = MOCK_PENDING.splice(index, 1)[0];
    return {
      success: true,
      message: 'Content approved successfully',
      item: { ...approvedItem, status: 'approved' }
    };
  }
  throw new Error('Request not found');
};

/**
 * Reject a content request
 * @param {string} id - Content ID
 * @param {string} reason - Reason for rejection
 */
export const reject = async (id, reason) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const index = MOCK_PENDING.findIndex(r => r.id === id);
  if (index !== -1) {
    const rejectedItem = MOCK_PENDING.splice(index, 1)[0];
    return {
      success: true,
      message: 'Content rejected',
      item: { ...rejectedItem, status: 'rejected', reason }
    };
  }
  throw new Error('Request not found');
};
