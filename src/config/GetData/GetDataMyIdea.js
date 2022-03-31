import axios from 'axios';
import {IdeaServiceBaseUrl} from '../Environment.cfg';

const GetDataSubmittedIdea = id => {
  return axios({
    crossDomain: true,
    method: 'post',
    url: `${IdeaServiceBaseUrl}/showmyideas`,
    data: {
      userId: id,
    },
    validateStatus: false,
  })
    .then(function ({status, data}) {
      if (status === 200) {
        return data.data;
      }
    })
    .catch(function (error) {
      console.log(error);
      // need handling error
    });
};

const GetDataSharingIdea = id => {
  return axios({
    crossDomain: true,
    method: 'post',
    url: `${IdeaServiceBaseUrl}/showmyideassharing`,
    data: {
      userId: id,
    },
    validateStatus: false,
  })
    .then(function ({status, data}) {
      if (status === 200) {
        return data.data;
      }
    })
    .catch(function (error) {
      console.log(error);
      // need handling error
    });
};

export {GetDataSubmittedIdea, GetDataSharingIdea};
