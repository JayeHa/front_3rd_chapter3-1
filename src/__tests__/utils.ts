import { Event } from '../types';
import { fillZero } from '../utils/dateUtils';

export const assertDate = (date1: Date, date2: Date) => {
  expect(date1.toISOString()).toBe(date2.toISOString());
};

export const parseHM = (timestamp: number) => {
  const date = new Date(timestamp);
  const h = fillZero(date.getHours());
  const m = fillZero(date.getMinutes());
  return `${h}:${m}`;
};

type BaseEvent = Pick<Event, 'id' | 'title' | 'date'>;
type OptionalEventProperties = Partial<
  Pick<
    Event,
    | 'startTime'
    | 'endTime'
    | 'description'
    | 'location'
    | 'category'
    | 'repeat'
    | 'notificationTime'
  >
>;

type TestEvent = BaseEvent & OptionalEventProperties;

/**
 * 테스트용 이벤트를 생성하기 위한 헬퍼 함수입니다.
 * 기본값을 사용하여 이벤트를 쉽게 만들 수 있습니다.
 */
export const generateTestEvent = ({
  id,
  title,
  date,
  startTime = '09:00',
  endTime = '10:00',
  description = '',
  location = '',
  category = '업무',
  repeat = { type: 'none', interval: 0 },
  notificationTime = 10,
}: TestEvent): Event => {
  return {
    id,
    title,
    date,
    startTime,
    endTime,
    description,
    location,
    category,
    repeat,
    notificationTime,
  };
};

/**
 * 여러 개의 테스트 이벤트를 생성하는 헬퍼 함수입니다.
 */
export const generateTestEvents = (events: TestEvent[]): Event[] => {
  return events.map((event) => generateTestEvent(event));
};
