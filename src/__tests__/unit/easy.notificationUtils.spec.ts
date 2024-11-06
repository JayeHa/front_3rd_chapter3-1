import { getUpcomingEvents } from '../../utils/notificationUtils';
import { generateTestEvents } from '../utils';

describe('getUpcomingEvents', () => {
  const now = new Date('2024-11-06T08:50');
  it('알림 시간이 정확히 도래한 이벤트를 반환한다', () => {
    const events = generateTestEvents([
      {
        id: '1',
        title: '알림시간에 맞는 이벤트',
        date: '2024-11-06',
        startTime: '09:00',
        endTime: '10:00',
        notificationTime: 10,
      },
    ]);

    expect(getUpcomingEvents(events, now, [])).toEqual([events[0]]);
  });

  it('이미 알림이 간 이벤트는 제외한다', () => {
    const NOTIFIED_ID = 'notified';
    const events = generateTestEvents([
      {
        id: NOTIFIED_ID,
        title: '이미 알람이 간 이벤트',
        date: '2024-11-06',
        startTime: '09:00',
        endTime: '10:00',
        notificationTime: 10,
      },
      {
        id: '2',
        title: '아직 알람이 가지 않은 이벤트',
        date: '2024-11-06',
        startTime: '09:00',
        endTime: '10:00',
        notificationTime: 20,
      },
    ]);

    expect(getUpcomingEvents(events, now, [NOTIFIED_ID])).toEqual([events[1]]);
  });

  it('알림 시간이 아직 도래하지 않은 이벤트는 반환하지 않는다', () => {
    const events = generateTestEvents([
      {
        id: '1',
        title: '알림시간에 맞는 이벤트',
        date: '2024-11-06',
        startTime: '09:00',
        endTime: '10:00',
        notificationTime: 10,
      },
      {
        id: '2',
        title: '알림시간이 아직 도래하지 않은 이벤트',
        date: '2024-11-06',
        startTime: '09:00',
        endTime: '10:00',
        notificationTime: 5,
      },
    ]);

    expect(getUpcomingEvents(events, now, [])).toEqual([events[0]]);
  });

  it('알림 시간이 지난 이벤트는 반환하지 않는다', () => {
    const events = generateTestEvents([
      {
        id: '1',
        title: '알림시간에 맞는 이벤트',
        date: '2024-11-06',
        startTime: '09:00',
        endTime: '10:00',
        notificationTime: 10,
      },
      {
        id: '2',
        title: '알림시간이 이미 지난 이벤트',
        date: '2024-11-06',
        startTime: '08:00',
        endTime: '10:00',
        notificationTime: 10,
      },
    ]);

    expect(getUpcomingEvents(events, now, [])).toEqual([events[0]]);
  });
});

describe('createNotificationMessage', () => {
  it('올바른 알림 메시지를 생성해야 한다', () => {});
});
