import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Clock, Loader2 } from 'lucide-react';
import { timeService } from '../services/timeService';

interface TimerProps {
  taskId: string;
}

const Timer: React.FC<TimerProps> = ({ taskId }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const fetchTimeData = async () => {
      try {
        setLoading(true);
        const entries = await timeService.getTimeEntries(taskId);
        
        // Calculate total time from completed entries
        const total = entries.reduce((acc, entry) => acc + (entry.duration_minutes || 0), 0);
        setTotalTime(total);

        // Check if there's an active timer
        const activeEntry = entries.find(e => !e.end_time);
        if (activeEntry) {
          const start = new Date(activeEntry.start_time);
          setStartTime(start);
          setIsRunning(true);
          const now = new Date();
          setElapsed(Math.floor((now.getTime() - start.getTime()) / 1000));
        }
      } catch (err) {
        console.error('Error fetching time entries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeData();

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [taskId]);

  useEffect(() => {
    if (isRunning && startTime) {
      intervalRef.current = window.setInterval(() => {
        const now = new Date();
        setElapsed(Math.floor((now.getTime() - startTime.getTime()) / 1000));
      }, 1000);
    } else {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
  }, [isRunning, startTime]);

  const handleStart = async () => {
    try {
      const entry = await timeService.startTimer(taskId);
      setStartTime(new Date(entry.start_time));
      setIsRunning(true);
      setElapsed(0);
    } catch (err) {
      console.error('Failed to start timer:', err);
    }
  };

  const handleStop = async () => {
    try {
      const entry = await timeService.stopTimer(taskId);
      setIsRunning(false);
      setStartTime(null);
      setTotalTime(prev => prev + (entry.duration_minutes || 0));
    } catch (err) {
      console.error('Failed to stop timer:', err);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatMinutes = (minutes: number) => {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  };

  if (loading) {
    return <Loader2 className="w-4 h-4 animate-spin text-gray-400" />;
  }

  return (
    <div className="flex flex-col gap-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold uppercase tracking-wider">
          <Clock size={14} />
          Time Tracking
        </div>
        <div className="text-xs font-medium text-gray-400">
          Total: {formatMinutes(totalTime)}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-2">
        <div className={`text-2xl font-mono font-bold ${isRunning ? 'text-indigo-600' : 'text-gray-400'}`}>
          {formatTime(elapsed)}
        </div>
        
        {isRunning ? (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors text-sm font-bold shadow-sm"
          >
            <Square size={16} fill="currentColor" />
            Stop
          </button>
        ) : (
          <button
            onClick={handleStart}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors text-sm font-bold shadow-sm"
          >
            <Play size={16} fill="currentColor" />
            Start Timer
          </button>
        )}
      </div>
    </div>
  );
};

export default Timer;
