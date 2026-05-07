
const MOCK_PENDING_REQUESTS = [
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

export const getPendingApprovals = async () => {
  await new Promise(resolve => setTimeout(resolve, 700));
  return MOCK_PENDING_REQUESTS;
};

/**
 * Approve a content request
 * @param {string} contentId 
 * @param {string} feedback Optional feedback from principal
 */
export const approveContent = async (contentId, feedback = '') => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const request = MOCK_PENDING_REQUESTS.find(r => r.id === contentId);
  if (request) {
    request.status = 'approved';
    request.feedback = feedback;

    return { success: true, message: 'Content approved successfully' };
  }
  throw new Error('Request not found');
};

/**
 * Reject a content request
 * @param {string} contentId 
 * @param {string} reason Reason for rejection
 */
export const rejectContent = async (contentId, reason) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  const request = MOCK_PENDING_REQUESTS.find(r => r.id === contentId);
  if (request) {
    request.status = 'rejected';
    request.rejectionReason = reason;
    return { success: true, message: 'Content rejected' };
  }
  throw new Error('Request not found');
};


export const getApprovalHistory = async () => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return [
    {
      id: 'cnt_01',
      title: 'Advanced Calculus - Week 4',
      teacherName: 'Prof. Alexander Wright',
      status: 'approved',
      processedAt: '2024-05-01T11:00:00Z'
    }
  ];
};
