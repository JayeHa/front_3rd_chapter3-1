import { renderHook, waitFor } from '@testing-library/react';
import { act } from 'react';

import { setupMockHandlerCreation } from '../../__mocks__/handlersUtils.ts';
import { useEventOperations } from '../../hooks/useEventOperations.ts';
import { generateTestEvent, generateTestEvents } from '../utils.ts';

// ? Medium: 아래 toastFn과 mock과 이 fn은 무엇을 해줄까요?
const toastFn = vi.fn();

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => toastFn,
  };
});

it('저장되어있는 초기 이벤트 데이터를 적절하게 불러온다', async () => {
  setupMockHandlerCreation(
    generateTestEvents([{ id: '1', title: '이벤트 1', date: '2024-10-01' }])
  );

  const { result } = renderHook(() => useEventOperations(false));

  await waitFor(() => {
    expect(result.current.events).toHaveLength(1);
    expect(result.current.events[0].title).toBe('이벤트 1');
  });
});

it('정의된 이벤트 정보를 기준으로 적절하게 저장이 된다', async () => {
  setupMockHandlerCreation(
    generateTestEvents([{ id: '1', title: '이벤트 1', date: '2024-11-01' }])
  );

  const { result } = renderHook(() => useEventOperations(false));

  act(() => {
    result.current.saveEvent(generateTestEvent({ id: '1', title: '이벤트 2', date: '2024-11-2' }));
  });

  await waitFor(() => {
    expect(result.current.events).toHaveLength(2);
    expect(result.current.events[0].title).toBe('이벤트 1');
    expect(result.current.events[1].title).toBe('이벤트 2');
  });
});

it("새로 정의된 'title', 'endTime' 기준으로 적절하게 일정이 업데이트 된다", async () => {});

it('존재하는 이벤트 삭제 시 에러없이 아이템이 삭제된다.', async () => {});

it("이벤트 로딩 실패 시 '이벤트 로딩 실패'라는 텍스트와 함께 에러 토스트가 표시되어야 한다", async () => {});

it("존재하지 않는 이벤트 수정 시 '일정 저장 실패'라는 토스트가 노출되며 에러 처리가 되어야 한다", async () => {});

it("네트워크 오류 시 '일정 삭제 실패'라는 텍스트가 노출되며 이벤트 삭제가 실패해야 한다", async () => {});
