import { renderHook } from '@testing-library/react';
import { act } from 'react';

import { useSearch } from '../../hooks/useSearch.ts';
import { Event } from '../../types.ts';
import { generateTestEvents } from '../utils.ts';

const currentDate = new Date('2024-11-1');

const setup = (events: Event[], view: 'week' | 'month' = 'month') =>
  renderHook(() => useSearch(events, currentDate, view));

it('검색어가 비어있을 때 모든 이벤트를 반환해야 한다', () => {
  const events = generateTestEvents([
    { id: '1', title: '이벤트 1', date: '2024-11-1' },
    { id: '2', title: '이벤트 2', date: '2024-11-2' },
    { id: '3', title: '이벤트 3', date: '2024-11-3' },
  ]);
  const { result } = setup(events);

  expect(result.current.filteredEvents).toEqual(events);
});

it('검색어에 맞는 이벤트만 필터링해야 한다', () => {
  const events = generateTestEvents([
    { id: '1', title: '🔎 검색할 이벤트 1', date: '2024-11-1' },
    { id: '2', title: '이벤트 2', date: '2024-11-2' },
    { id: '3', title: '🔎 검색할 이벤트 3', date: '2024-11-3' },
  ]);
  const { result } = setup(events);

  act(() => {
    result.current.setSearchTerm('검색');
  });

  expect(result.current.filteredEvents).toEqual([events[0], events[2]]);
});

it('검색어가 제목, 설명, 위치 중 하나라도 일치하면 해당 이벤트를 반환해야 한다', () => {
  const events = generateTestEvents([
    { id: '1', title: '🔎 검색할 이벤트 1', date: '2024-11-1' },
    { id: '2', title: '이벤트 2', date: '2024-11-2', description: '🔎 검색할 이벤트 설명' },
    { id: '3', title: '이벤트 3', date: '2024-11-3', location: '🔎 검색할 이벤트 위치' },
    { id: '4', title: '이벤트 4', date: '2024-11-4' },
  ]);
  const { result } = setup(events);

  act(() => {
    result.current.setSearchTerm('검색');
  });

  expect(result.current.filteredEvents).toEqual([events[0], events[1], events[2]]);
});

it('현재 뷰(주간/월간)에 해당하는 이벤트만 반환해야 한다', () => {
  const events = generateTestEvents([
    { id: '1', title: '10월 5주 이벤트 1', date: '2024-11-1' },
    { id: '2', title: '10월 5주 이벤트 2', date: '2024-11-2' },
    { id: '3', title: '11월 2주 이벤트', date: '2024-11-15' },
    { id: '4', title: '12월 1주 이벤트', date: '2024-12-1' },
  ]);

  const { result: monthResult } = setup(events, 'month');
  expect(monthResult.current.filteredEvents).toEqual([events[0], events[1], events[2]]);

  const { result: weekResult } = setup(events, 'week');
  expect(weekResult.current.filteredEvents).toEqual([events[0], events[1]]);
});

it("검색어를 '회의'에서 '점심'으로 변경하면 필터링된 결과가 즉시 업데이트되어야 한다", () => {
  const events = generateTestEvents([
    { id: '1', title: '회의 1', date: '2024-11-4' },
    { id: '2', title: '점심 1', date: '2024-11-5' },
    { id: '3', title: '회의 2', date: '2024-11-6' },
    { id: '4', title: '점심 2', date: '2024-11-7' },
  ]);
  const { result } = setup(events);

  act(() => {
    result.current.setSearchTerm('회의');
  });
  expect(result.current.filteredEvents).toEqual([events[0], events[2]]);

  act(() => {
    result.current.setSearchTerm('점심');
  });
  expect(result.current.filteredEvents).toEqual([events[1], events[3]]);
});
