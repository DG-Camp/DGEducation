import React from 'react';
import { Course } from '../../shared/types';
import { LessonViewPage } from '../lessons/LessonViewPage';

export interface LessonQuizViewProps {
  course: Course;
  initialLessonId?: string;
  onLessonChange?: (lessonId: string) => void;
  onBackToCourseList?: () => void;
}

export const LessonQuizView: React.FC<LessonQuizViewProps> = ({
  course,
  initialLessonId,
  onBackToCourseList
}) => {
  return (
    <LessonViewPage 
      course={course} 
      initialLessonId={initialLessonId} 
      onBackToCourseList={onBackToCourseList} 
    />
  );
};
