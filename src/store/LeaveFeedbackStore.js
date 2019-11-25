
import axios from 'axios';
import { get } from 'lodash-es';

export default function createLeaveFeedbackStore() {
  return {
    actions: {
      initState() { },

      async postFeedback({ rootState }, { review, url }) {
        try {
          await axios.post(
            `${rootState.config.apiUrl}/api/v1/user/feedback`,
            {
              review,
              url,
            },
          );
        } catch (error) {
          console.error(error);
          throw new Error(
            get(error, 'response.data.message', 'Unknown error'),
          );
        }
      },
    },

    namespaced: true,
  };
}
