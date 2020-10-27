import axios from 'axios';

import { Cookie, Soldier } from '../models';
import { addLog, buildRequestUrl } from '../utils';

/**
 * 군인 정보를 가져온다.
 * @param cookies - 세션 식별을 위한 쿠키
 * @param soldier - 확인할 군인 정보
 */
async function fetchSoldiers(cookies: Cookie, soldier: Soldier) {
  const options = {
    url: buildRequestUrl('main/cafeCreateCheckA.do'),
    method: 'POST',
    json: true,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Cookie: `${cookies.iuid}; ${cookies.token}`,
    },
    form: {
      name: soldier.getName(),
      birth: soldier.getBirth(),
      enterDate: soldier.getEnterDate(),
    },
  };

  try {
    const res = await axios.post(
      options.url,
      options.form,
      { 
        headers: options.headers
      }
    )

    addLog('fetchSoldier', `${res.status} ${res.statusText}`);

    if (res.status === 200 && res.data.resultCd !== '9999') {
      throw new Error(res.data.resultMsg || '알 수 없는 에러.');
    }

    if (!res) {
      throw new Error('응답 값이 없습니다.');
    }

    const result: Soldier[] = res.data.listResult.map((fetchedSoldierInfo) => {
      const { traineeMgrSeq } = fetchedSoldierInfo;
      const clonedSoldier = soldier.clone();
      clonedSoldier.setTraineeMgrSeq(traineeMgrSeq);
      return clonedSoldier;
    });
  
    if (!result || result.length === 0) {
      throw new Error('해당하는 군인을 찾을 수 없습니다.');
    }
  
    return result;
  } catch (e) {
    throw new Error(e);
  }
}

export { fetchSoldiers };
