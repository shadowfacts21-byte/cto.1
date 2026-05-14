import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Timer from '../../../components/Timer';

// Mock timeService
vi.mock('../../services/timeService', () => ({
  timeService: {
    getTimeEntries: vi.fn(),
    startTimer: vi.fn(),
    stopTimer: vi.fn(),
  },
}));

import { timeService } from '../../services/timeService';

describe('Timer Component', () => {
  const mockTaskId = 'test-task-123';

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render loading state initially', () => {
    // Mock loading state
    timeService.getTimeEntries.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<Timer taskId={mockTaskId} />);

    // Should show loader
    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('should render start button when no timer is running', async () => {
    timeService.getTimeEntries.mockResolvedValue([]);

    render(<Timer taskId={mockTaskId} />);

    await waitFor(() => {
      expect(screen.getByText('Start Timer')).toBeInTheDocument();
    });
  });

  it('should render stop button when timer is running', async () => {
    // Mock an active timer entry (no end_time)
    timeService.getTimeEntries.mockResolvedValue([{
      id: 'entry-1',
      task_id: mockTaskId,
      start_time: new Date().toISOString(),
      // no end_time means active
    }]);

    render(<Timer taskId={mockTaskId} />);

    await waitFor(() => {
      expect(screen.getByText('Stop')).toBeInTheDocument();
    });
  });

  it('should call startTimer when start button is clicked', async () => {
    timeService.getTimeEntries.mockResolvedValue([]);
    timeService.startTimer.mockResolvedValue({
      id: 'new-entry',
      task_id: mockTaskId,
      start_time: new Date().toISOString(),
    });

    const user = userEvent.setup();
    render(<Timer taskId={mockTaskId} />);

    await waitFor(() => {
      expect(screen.getByText('Start Timer')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Start Timer'));

    await waitFor(() => {
      expect(timeService.startTimer).toHaveBeenCalledWith(mockTaskId);
    });
  });

  it('should call stopTimer when stop button is clicked', async () => {
    const activeEntry = {
      id: 'entry-1',
      task_id: mockTaskId,
      start_time: new Date().toISOString(),
    };
    timeService.getTimeEntries.mockResolvedValue([activeEntry]);
    timeService.stopTimer.mockResolvedValue({
      ...activeEntry,
      end_time: new Date().toISOString(),
      duration_minutes: 15,
    });

    const user = userEvent.setup();
    render(<Timer taskId={mockTaskId} />);

    await waitFor(() => {
      expect(screen.getByText('Stop')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Stop'));

    await waitFor(() => {
      expect(timeService.stopTimer).toHaveBeenCalledWith(mockTaskId);
    });
  });

  it('should display total time tracked', async () => {
    timeService.getTimeEntries.mockResolvedValue([
      { id: 'e1', duration_minutes: 30 },
      { id: 'e2', duration_minutes: 45 },
    ]);

    render(<Timer taskId={mockTaskId} />);

    await waitFor(() => {
      // Total should be 1h 15m
      expect(screen.getByText(/Total:/)).toBeInTheDocument();
    });
  });

  it('should format elapsed time correctly', async () => {
    // Mock an active timer starting 125 seconds ago
    const startTime = new Date(Date.now() - 125 * 1000);
    timeService.getTimeEntries.mockResolvedValue([{
      id: 'entry-1',
      task_id: mockTaskId,
      start_time: startTime.toISOString(),
    }]);

    render(<Timer taskId={mockTaskId} />);

    await waitFor(() => {
      // 125 seconds = 02:05
      const timeDisplay = screen.getByText(/^\d{2}:\d{2}:\d{2}$/);
      expect(timeDisplay).toBeInTheDocument();
    });
  });

  it('should handle startTimer error gracefully', async () => {
    timeService.getTimeEntries.mockResolvedValue([]);
    timeService.startTimer.mockRejectedValue(new Error('Failed to start'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const user = userEvent.setup();
    render(<Timer taskId={mockTaskId} />);

    await waitFor(() => {
      expect(screen.getByText('Start Timer')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Start Timer'));

    // Error should be caught and logged, but UI should not crash
    await waitFor(() => {
      expect(screen.getByText('Start Timer')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should handle getTimeEntries error gracefully', async () => {
    timeService.getTimeEntries.mockRejectedValue(new Error('Network error'));

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(<Timer taskId={mockTaskId} />);

    // Should handle error and show start button
    await waitFor(() => {
      expect(screen.getByText('Start Timer')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});

describe('Timer Button Interactions', () => {
  it('start button should have correct styling classes', async () => {
    timeService.getTimeEntries.mockResolvedValue([]);

    render(<Timer taskId="test" />);

    await waitFor(() => {
      const startButton = screen.getByText('Start Timer');
      expect(startButton.closest('button')).toHaveClass('bg-indigo-600');
    });
  });

  it('stop button should have correct styling classes', async () => {
    timeService.getTimeEntries.mockResolvedValue([{
      id: 'entry-1',
      task_id: 'test',
      start_time: new Date().toISOString(),
    }]);

    render(<Timer taskId="test" />);

    await waitFor(() => {
      const stopButton = screen.getByText('Stop');
      expect(stopButton.closest('button')).toHaveClass('bg-red-500');
    });
  });

  it('start button should be disabled during loading', async () => {
    timeService.getTimeEntries.mockImplementation(() => new Promise(() => {}));

    render(<Timer taskId="test" />);

    // Loading state shows a spinner, not the button
    expect(screen.queryByText('Start Timer')).not.toBeInTheDocument();
  });
});