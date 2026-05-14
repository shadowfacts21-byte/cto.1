import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TimeTracking from '../../../components/TimeTracking';

// Mock timeService
vi.mock('../../services/timeService', () => ({
  timeService: {
    getProjectReport: vi.fn(),
  },
}));

import { timeService } from '../../services/timeService';

describe('TimeTracking Component', () => {
  const mockProjectId = 'test-project-123';

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render loading state initially', () => {
    timeService.getProjectReport.mockImplementation(() => new Promise(() => {}));

    render(<TimeTracking projectId={mockProjectId} />);

    expect(screen.getByRole('img')).toBeInTheDocument();
  });

  it('should render time report cards after loading', async () => {
    timeService.getProjectReport.mockResolvedValue([
      { project_id: mockProjectId, user_name: 'John Doe', total_minutes: 450 },
      { project_id: mockProjectId, user_name: 'Jane Smith', total_minutes: 320 },
    ]);

    render(<TimeTracking projectId={mockProjectId} />);

    await waitFor(() => {
      expect(screen.getByText('Time by Team Member')).toBeInTheDocument();
      expect(screen.getByText('Total Project Time')).toBeInTheDocument();
    });
  });

  it('should display user names and time correctly', async () => {
    timeService.getProjectReport.mockResolvedValue([
      { project_id: mockProjectId, user_name: 'John Doe', total_minutes: 450 },
    ]);

    render(<TimeTracking projectId={mockProjectId} />);

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('7h 30m')).toBeInTheDocument(); // 450 minutes
    });
  });

  it('should show empty state when no reports', async () => {
    timeService.getProjectReport.mockResolvedValue([]);

    render(<TimeTracking projectId={mockProjectId} />);

    await waitFor(() => {
      expect(screen.getByText(/No time logged yet/i)).toBeInTheDocument();
    });
  });

  it('should calculate total project time correctly', async () => {
    timeService.getProjectReport.mockResolvedValue([
      { project_id: mockProjectId, user_name: 'John Doe', total_minutes: 450 },
      { project_id: mockProjectId, user_name: 'Jane Smith', total_minutes: 330 },
    ]);

    render(<TimeTracking projectId={mockProjectId} />);

    await waitFor(() => {
      // Total: 450 + 330 = 780 minutes = 13h 0m
      expect(screen.getByText('13h 0m')).toBeInTheDocument();
    });
  });

  it('should handle errors gracefully', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    timeService.getProjectReport.mockRejectedValue(new Error('Network error'));

    render(<TimeTracking projectId={mockProjectId} />);

    // Should handle error without crashing
    await waitFor(() => {
      // Component may show empty state or partial content
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });
});

describe('TimeTracking UI Elements', () => {
  it('should render progress bars for each user', async () => {
    timeService.getProjectReport.mockResolvedValue([
      { project_id: 'p1', user_name: 'John Doe', total_minutes: 100 },
      { project_id: 'p1', user_name: 'Jane Smith', total_minutes: 50 },
    ]);

    render(<TimeTracking projectId="p1" />);

    await waitFor(() => {
      // Should have two progress bars
      const progressBars = screen.getAllByRole('progressbar');
      expect(progressBars.length).toBeGreaterThanOrEqual(2);
    });
  });

  it('should render table headers correctly', async () => {
    timeService.getProjectReport.mockResolvedValue([
      { project_id: 'p1', user_name: 'John Doe', total_minutes: 100 },
    ]);

    render(<TimeTracking projectId="p1" />);

    await waitFor(() => {
      expect(screen.getByText('User')).toBeInTheDocument();
      expect(screen.getByText('Date')).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
      expect(screen.getByText('Duration')).toBeInTheDocument();
    });
  });

  it('should show clock icon in total section', async () => {
    timeService.getProjectReport.mockResolvedValue([
      { project_id: 'p1', user_name: 'John Doe', total_minutes: 100 },
    ]);

    render(<TimeTracking projectId="p1" />);

    await waitFor(() => {
      const clockIcon = screen.getByRole('img', { name: /clock/i });
      expect(clockIcon).toBeInTheDocument();
    });
  });

  it('should show pie chart icon in report section', async () => {
    timeService.getProjectReport.mockResolvedValue([
      { project_id: 'p1', user_name: 'John Doe', total_minutes: 100 },
    ]);

    render(<TimeTracking projectId="p1" />);

    await waitFor(() => {
      const pieChartIcon = screen.getByRole('img', { name: /piechart/i });
      expect(pieChartIcon).toBeInTheDocument();
    });
  });
});

describe('TimeTracking Formatting', () => {
  it('should format minutes correctly as hours and minutes', async () => {
    timeService.getProjectReport.mockResolvedValue([
      { project_id: 'p1', user_name: 'Test User', total_minutes: 125 },
    ]);

    render(<TimeTracking projectId="p1" />);

    await waitFor(() => {
      // 125 minutes = 2h 5m
      expect(screen.getByText('2h 5m')).toBeInTheDocument();
    });
  });

  it('should handle zero minutes', async () => {
    timeService.getProjectReport.mockResolvedValue([
      { project_id: 'p1', user_name: 'Test User', total_minutes: 0 },
    ]);

    render(<TimeTracking projectId="p1" />);

    await waitFor(() => {
      expect(screen.getByText('0h 0m')).toBeInTheDocument();
    });
  });

  it('should handle large minute values', async () => {
    timeService.getProjectReport.mockResolvedValue([
      { project_id: 'p1', user_name: 'Test User', total_minutes: 1500 },
    ]);

    render(<TimeTracking projectId="p1" />);

    await waitFor(() => {
      // 1500 minutes = 25h 0m
      expect(screen.getByText('25h 0m')).toBeInTheDocument();
    });
  });
});