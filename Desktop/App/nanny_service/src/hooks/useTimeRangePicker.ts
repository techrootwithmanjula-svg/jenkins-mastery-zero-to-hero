/**
 * useTimeRangePicker
 *
 * Two-click time range selection hook. On the first call to `pickTime` the start
 * time is stored and the active field advances to 'end'. On the second call the
 * end time is stored, validation runs, and the active field resets to null.
 *
 * Validation rules (same as validateSubscriptionPayload):
 *  - Both times within 08:00–20:00
 *  - endTime > startTime
 *  - Duration ≥ 3 hours (180 min)
 */

import { useState, useCallback } from 'react';

// ---------- types ----------------------------------------------------------------

export type ActiveField = 'start' | 'end' | null;

export interface TimeRangeState {
  startTime: string | null;
  endTime: string | null;
  activeField: ActiveField;
  errors: Record<string, string>;
}

export interface UseTimeRangePickerReturn extends TimeRangeState {
  /** Begin a new selection flow from scratch, optionally pre-setting both times. */
  reset: (initialStart?: string, initialEnd?: string) => void;
  /**
   * Select the next time value.
   *  - If activeField is 'start' (or null), stores startTime and advances to 'end'.
   *  - If activeField is 'end', stores endTime, validates, and clears activeField.
   */
  pickTime: (time: string) => void;
  /** Explicitly begin re-picking the start time (clears end and errors). */
  beginStartPick: () => void;
  /** Explicitly begin re-picking the end time (keeps start, clears end and errors). */
  beginEndPick: () => void;
}

// ---------- helpers --------------------------------------------------------------

const MIN_START = 8 * 60;   // 08:00
const MAX_END   = 20 * 60;  // 20:00
const MIN_DURATION = 3 * 60; // 3 hours

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function validate(start: string, end: string): Record<string, string> {
  const errs: Record<string, string> = {};
  const startMin = toMinutes(start);
  const endMin   = toMinutes(end);

  if (startMin < MIN_START || startMin >= MAX_END) {
    errs.startTime = 'Start time must be between 08:00 and 20:00';
  }
  if (endMin <= MIN_START || endMin > MAX_END) {
    errs.endTime = 'End time must be between 08:00 and 20:00';
  }
  if (!errs.startTime && !errs.endTime) {
    if (endMin <= startMin) {
      errs.endTime = 'End time must be after start time';
    } else if (endMin - startMin < MIN_DURATION) {
      errs.endTime = 'Session duration must be at least 3 hours';
    }
  }
  return errs;
}

// ---------- hook -----------------------------------------------------------------

export function useTimeRangePicker(
  initialStart?: string,
  initialEnd?: string,
): UseTimeRangePickerReturn {
  const [state, setState] = useState<TimeRangeState>({
    startTime: initialStart ?? null,
    endTime: initialEnd ?? null,
    activeField: null,
    errors: {},
  });

  const reset = useCallback((start?: string, end?: string) => {
    setState({
      startTime: start ?? null,
      endTime: end ?? null,
      activeField: null,
      errors: {},
    });
  }, []);

  const beginStartPick = useCallback(() => {
    setState(prev => ({
      ...prev,
      endTime: null,
      activeField: 'start',
      errors: {},
    }));
  }, []);

  const beginEndPick = useCallback(() => {
    setState(prev => ({
      ...prev,
      endTime: null,
      activeField: 'end',
      errors: {},
    }));
  }, []);

  const pickTime = useCallback((time: string) => {
    setState(prev => {
      // If activeField is null or 'start', treat this as picking the start time.
      if (prev.activeField !== 'end') {
        return {
          ...prev,
          startTime: time,
          endTime: null,
          activeField: 'end',
          errors: {},
        };
      }

      // Picking end time — validate immediately.
      const start = prev.startTime ?? '';
      const errs = start ? validate(start, time) : { startTime: 'Start time is required' };

      return {
        ...prev,
        endTime: time,
        activeField: null,
        errors: errs,
      };
    });
  }, []);

  return { ...state, pickTime, reset, beginStartPick, beginEndPick };
}

export default useTimeRangePicker;
