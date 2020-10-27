import axios from 'axios';

import { Cookie, Soldier } from '../models';
import { addLog, buildRequestUrl } from '../utils';

/**
 * 군인을 추가한다.
 * @param cookies - 세션 식별을 위한 쿠키
 * @param soldier - 추가할 군인 정보
 */
async function addSoldier(cookies: Cookie, soldier: Soldier) {
  const options = {
    url: buildRequestUrl('missSoldier/insertDirectMissSoldierA.do'),
    method: 'POST',
    json: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: `${cookies.iuid}; ${cookies.token}`,
    },
    form: {
      missSoldierClassCdNm: soldier.getMissSoldierClassCdNm(),
      grpCdNm: soldier.getGrpCdNm(),
      missSoldierClassCd: soldier.getMissSoldierClassCd(),
      grpCd: soldier.getGrpCd(),
      name: soldier.getName(),
      birth: soldier.getBirth(),
      enterDate: soldier.getEnterDate(),
    },
  };

  try {
    const response = await axios.post(
      options.url,
      options.form,
      {
        headers: options.headers
      },
    );

    addLog('addSoldier', `${response.status} ${response.statusText}`);

    if (response.status === 200 && response.data.resultCd !== '0000' && response.data.resultCd !== 'E001') {
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

export { addSoldier };
