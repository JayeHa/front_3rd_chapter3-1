/**
 * Vitest 환경에서 Zustand 스토어를 모킹하기 위한 설정입니다.
 * 이 설정을 통해 테스트 시 Zustand 스토어의 초기 상태를 유지하고, 테스트 후 상태를 리셋할 수 있습니다.
 *
 * @see https://zustand.docs.pmnd.rs/guides/testing#vitest
 */
import { act } from '@testing-library/react';
import type * as ZustandExportedTypes from 'zustand';
export * from 'zustand';

const { create: actualCreate, createStore: actualCreateStore } =
  await vi.importActual<typeof ZustandExportedTypes>('zustand');

// a variable to hold reset functions for all stores declared in the app
export const storeResetFns = new Set<() => void>();

const createUncurried = <T>(stateCreator: ZustandExportedTypes.StateCreator<T>) => {
  const store = actualCreate(stateCreator);
  const initialState = store.getInitialState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
};

// when creating a store, we get its initial state, create a reset function and add it in the set
export const create = (<T>(stateCreator: ZustandExportedTypes.StateCreator<T>) => {
  console.log('zustand create mock');

  // to support curried version of create
  return typeof stateCreator === 'function' ? createUncurried(stateCreator) : createUncurried;
}) as typeof ZustandExportedTypes.create;

const createStoreUncurried = <T>(stateCreator: ZustandExportedTypes.StateCreator<T>) => {
  const store = actualCreateStore(stateCreator);
  const initialState = store.getInitialState();
  storeResetFns.add(() => {
    store.setState(initialState, true);
  });
  return store;
};

// when creating a store, we get its initial state, create a reset function and add it in the set
export const createStore = (<T>(stateCreator: ZustandExportedTypes.StateCreator<T>) => {
  console.log('zustand createStore mock');

  // to support curried version of createStore
  return typeof stateCreator === 'function'
    ? createStoreUncurried(stateCreator)
    : createStoreUncurried;
}) as typeof ZustandExportedTypes.createStore;

// reset all stores after each test run
afterEach(() => {
  act(() => {
    storeResetFns.forEach((resetFn) => {
      resetFn();
    });
  });
});
