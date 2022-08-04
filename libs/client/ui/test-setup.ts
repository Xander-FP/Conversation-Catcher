import '@testing-library/jest-native/extend-expect';

jest.mock('react-native-share', () => {
  return {
    open: jest.fn(),
  };
});

jest.mock('react-native-audio-record', () => {
  return {
    open: jest.fn(),
  };
});

jest.mock('@react-native-firebase/auth', () => {
  return {
    open: jest.fn(),
  };
});
