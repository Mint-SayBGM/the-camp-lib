
import Axios from 'axios';
import { Soldier, Message, Cookie, SoldierClass } from '../models';
import { buildRequestUrl, addLog } from '../utils';

/**
 * 인터넷 편지를 전송한다.
 * @param cookies - 세션 식별을 위한 쿠키
 * @param trainee - 훈련병 정보
 * @param message - 인터넷 편지 정보
 */
async function sendMessage(cookies: Cookie, trainee: Soldier, message: Message) {
  if (trainee.getMissSoldierClassCd() !== SoldierClass['예비군인/훈련병']) {
    throw new Error('예비군인/훈련병에게만 편지를 보낼 수 있습니다.');
  }

  const options = {
    uri: buildRequestUrl('consolLetter/insertConsolLetterA.do?'),
    method: 'POST',
    json: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: `${cookies.iuid}; ${cookies.token}`,
    },
    form: {
      traineeMgrSeq: message.getTraineeMgrSeq(),
      sympathyLetterContent: message.getSympathyLetterContent(),
      sympathyLetterSubject: message.getSympathyLetterSubject(),
      boardDiv: 'sympathyLetter',
      tempSaveYn: 'N',
    },
  };

  try {
    const response = await Axios.post(
      options.uri,
      options.form,
      {
        headers: options.headers
      }
    )

    addLog('sendMessage', `${response.status} ${response.statusText}`);

    if (response.status === 200 && response.data.resultCd !== '0000') {
      throw new Error(response.data.resultMsg || '알 수 없는 에러.');
    }

    if (!response) {
      throw new Error('응답 값이 없습니다.');
    }
  
    return true;
  } catch (e) {
    throw new Error(e);
  }
}

export { sendMessage };
