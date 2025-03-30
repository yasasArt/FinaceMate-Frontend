import { useState } from "react";
import GoalCard from "./GoalCard";

const GoalsPage = () => {
  const [goals, setGoals] = useState([
    { id: 1, title: "MacBook Pro", dueDate: "2024-10-07", saved: 412.5, target: 1650, progress: 25, status: "in progress" },
    { id: 2, title: "New Car", dueDate: "2025-09-25", saved: 25000, target: 60000, progress: 42, status: "in progress" },
    { id: 3, title: "New House", dueDate: "2027-04-20", saved: 5000, target: 150000, progress: 3, status: "not started" },
    { id: 4, title: "Vacation", dueDate: "2025-04-01", saved: 2500, target: 3500, progress: 71, status: "finished" },
  ]);

  const handleUpdateGoal = (updatedGoal) => {
    setGoals(goals.map(goal => goal.id === updatedGoal.id ? updatedGoal : goal));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Goals</h2>
      <div className="flex gap-4 flex-wrap">
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} onUpdate={handleUpdateGoal} />
        ))}
      </div>
    </div>
  );
};

export default GoalsPage;
