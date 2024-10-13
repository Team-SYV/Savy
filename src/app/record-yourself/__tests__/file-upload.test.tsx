import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { createQuestions, generateQuestions, getJobInformation } from '@/api';
import { Alert } from 'react-native';
import FileUpload from '../file-upload';

// Mocking the router and local search params
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(),
}));

// Mocking DocumentPicker
jest.mock('expo-document-picker', () => ({
  getDocumentAsync: jest.fn(),
}));

// Mocking API calls
jest.mock('@/api', () => ({
  createQuestions: jest.fn(),
  generateQuestions: jest.fn(),
  getJobInformation: jest.fn(),
}));

describe('FileUpload Component', () => {
  const mockRouter = {
    push: jest.fn(),
  };

  const mockSearchParams = {
    jobId: '123', // Example jobId for testing
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useLocalSearchParams as jest.Mock).mockReturnValue(mockSearchParams);
    (DocumentPicker.getDocumentAsync as jest.Mock).mockClear();
    jest.spyOn(Alert, 'alert'); // Mock the Alert.alert function
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly and allows file selection', async () => {
    // Mock a successful file selection
    (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ name: 'resume.pdf', uri: 'file://path/to/resume.pdf' }],
    });

    const { getByText } = render(<FileUpload />);

    // Simulate file selection
    fireEvent.press(getByText('Tap to Upload File'));

    await waitFor(() => {
      expect(getByText('Change File')).toBeTruthy();
    });
  });

  test('shows alert when starting interview without file', async () => {
    const { getByText } = render(<FileUpload />);

    // Simulate starting the interview
    fireEvent.press(getByText('Start Interview'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'No file uploaded',
        'Please upload your resume before starting the interview.'
      );
    });
  });

  test('uploads file and generates questions', async () => {
    (DocumentPicker.getDocumentAsync as jest.Mock).mockResolvedValueOnce({
      canceled: false,
      assets: [{ name: 'resume.pdf', uri: 'file://path/to/resume.pdf' }],
    });

    (getJobInformation as jest.Mock).mockResolvedValueOnce({
      industry: 'Technology',
      experience: 'Mid',
      type: 'Technical',
      company_name: 'Tech Company',
      role: 'Developer',
      job_description: 'Develop software solutions.',
    });

    (generateQuestions as jest.Mock).mockResolvedValueOnce(['What is your experience with React?', 'Why do you want to work here?']);

    const { getByText } = render(<FileUpload />);

    // Simulate file selection
    fireEvent.press(getByText('Tap to Upload File'));

    await waitFor(() => {
      expect(getByText('Change File')).toBeTruthy();
    });

    // Simulate starting the interview
    fireEvent.press(getByText('Start Interview'));

    await waitFor(() => {
      expect(generateQuestions).toHaveBeenCalled();
      expect(createQuestions).toHaveBeenCalledWith(expect.anything(), { question: 'What is your experience with React?' });
      expect(createQuestions).toHaveBeenCalledWith(expect.anything(), { question: 'Why do you want to work here?' });
      expect(mockRouter.push).toHaveBeenCalledWith('/record-yourself/record?jobId=123');
    });
  });
});
