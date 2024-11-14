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
type OptionalEventProperties = Partial<Omit<Event, 'id' | 'title' | 'date'>>;

type TestEvent = BaseEvent & OptionalEventProperties;

/**
 * 테스트 이벤트를 생성하는 헬퍼 함수입니다.
 * 필요한 속성만 제공하면 기본값을 사용하여 이벤트 객체를 쉽게 생성할 수 있습니다.
 *
 * @example
 * 아래와 같이 필수 값만 제공하여 이벤트를 생성할 수 있습니다.
 * 필요하지 않은 속성은 생략하면 기본값이 적용됩니다.
 *
 * const event = generateTestEvent({
 *   id: '1',
 *   title: '이벤트',
 *   date: '2024-01-01',
 * });
 *
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
