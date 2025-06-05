const backendDomain = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8080';
const SummaryApi = {
    register : {
        url : `${backendDomain}/api/register`,
        method : "POST"
    },
    login: {
        url: `${backendDomain}/api/login`,
        method: 'POST',
      },
    VerifyEmail : {
        url: `${backendDomain}/api/verify-email?token=`,
        method : 'GET'
    },
    createOrUpdateConversation: { 
        url: `${backendDomain}/api/conversations`, 
        method: 'POST' 
    },
    getConversations: { 
        url: `${backendDomain}/api/conversations`, 
        method: 'GET' 
    },
    getConversationMessages: {
         url: `${backendDomain}/api/conversations`, 
         method: 'GET' 
    },
}
export default SummaryApi;