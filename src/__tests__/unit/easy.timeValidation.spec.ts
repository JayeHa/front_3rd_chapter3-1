import { getTimeErrorMessage, TimeValidationResult } from '../../utils/timeValidation';

describe('getTimeErrorMessage >', () => {
  const validResult: TimeValidationResult = { startTimeError: null, endTimeError: null };
  const invalidResult: TimeValidationResult = {
    startTimeError: '시작 시간은 종료 시간보다 빨라야 합니다.',
    endTimeError: '종료 시간은 시작 시간보다 늦어야 합니다.',
  };

  it('시작 시간이 종료 시간보다 늦을 때 에러 메시지를 반환한다', () => {
    const start = '09:00';
    const end = '08:00';

    expect(getTimeErrorMessage(start, end)).toEqual(invalidResult);
  });

  it('시작 시간과 종료 시간이 같을 때 에러 메시지를 반환한다', () => {
    const start = '09:00';
    const end = '09:00';

    expect(getTimeErrorMessage(start, end)).toEqual(invalidResult);
  });

  it('시작 시간이 종료 시간보다 빠를 때 null을 반환한다', () => {
    const start = '09:00';
    const end = '10:00';

    expect(getTimeErrorMessage(start, end)).toEqual(validResult);
  });

  it('시작 시간이 비어있을 때 null을 반환한다', () => {
    const start = '';
    const end = '10:00';

    expect(getTimeErrorMessage(start, end)).toEqual(validResult);
  });

  it('종료 시간이 비어있을 때 null을 반환한다', () => {
    const start = '09:00';
    const end = '';

    expect(getTimeErrorMessage(start, end)).toEqual(validResult);
  });

  it('시작 시간과 종료 시간이 모두 비어있을 때 null을 반환한다', () => {
    const start = '';
    const end = '';

    expect(getTimeErrorMessage(start, end)).toEqual(validResult);
  });
});
