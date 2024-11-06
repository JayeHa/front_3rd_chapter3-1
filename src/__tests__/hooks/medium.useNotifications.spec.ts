import { renderHook } from '@testing-library/react';
import { act } from 'react';

import { useNotifications } from '../../hooks/useNotifications.ts';
import { generateTestEvents } from '../utils.ts';

beforeAll(() => {
  vi.useFakeTimers();
});

beforeEach(() => {
  vi.setSystemTime(new Date('2024-11-01T09:00'));
});

afterAll(() => {
  vi.useRealTimers();
});

const setup = () =>
  renderHook(() =>
    useNotifications(
      generateTestEvents([
        {
          id: '1',
          title: '이벤트',
          date: '2024-11-01',
          startTime: '09:05',
          endTime: '10:00',
          notificationTime: 10,
        },
      ])
    )
  );

it('초기 상태에서는 알림이 없어야 한다', () => {
  const { result } = setup();

  expect(result.current.notifications).toEqual([]);
});

it('지정된 시간이 된 경우 알림이 새롭게 생성되어 추가된다', () => {
  const { result } = setup();

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.notifications).toHaveLength(1);
});

it('index를 기준으로 알림을 적절하게 제거할 수 있다', () => {
  const { result } = setup();

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.notifications).toHaveLength(1);

  // 알림 제거
  act(() => {
    result.current.removeNotification(0);
  });

  expect(result.current.notifications).toHaveLength(0);
});

it('이미 알림이 발생한 이벤트에 대해서는 중복 알림이 발생하지 않아야 한다', () => {
  const { result } = setup();

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.notifications).toHaveLength(1);

  act(() => {
    vi.advanceTimersByTime(1000);
  });

  expect(result.current.notifications).toHaveLength(1);
});
