import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import CategoryCard from "./CategoryCard";
import AddCategoryModal from "./AddCategoryModal";
import CategoryDetailsModal from "./CategoryDetailsModal";
import AddBudgetModal from "./AddBudgetModal";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable"; // Use this exact import for v3+

axios.defaults.withCredentials = true;

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isCategoryDetailsOpen, setIsCategoryDetailsOpen] = useState(false);
  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8088/api/v1/categories"
        );
        setCategories(response.data.data.categories);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text("Categories Report", 14, 15);
  
    let y = 25;
  
    categories.forEach((cat) => {
      const line = `• Name: ${cat.name},    Description: ${cat.description || "N/A"},    Type: ${cat.type},    On Track: ${cat.onTrack ? "Yes" : "No"}`;
      doc.text(line, 14, y);
      y += 10;
    });
  
    doc.save("categories-report.pdf");
  };
  

  // Handle adding a new category
  const handleAddCategory = async (categoryData) => {
    try {
      const response = await axios.post(
        "http://localhost:8088/api/v1/categories",
        categoryData
      );
      setCategories([...categories, response.data.data]);
      setIsAddCategoryModalOpen(true);
      window.location.reload(); // Refresh the page to reflect changes
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle opening category details
  const openCategoryDetails = (category) => {
    setSelectedCategory(category);
    setIsCategoryDetailsOpen(true);
  };

  // Handle adding a budget to a category
  const handleAddBudget = async (budgetData) => {
    try {
      window.location.reload();
      // Add budget
      await axios.post("api/v1/budgets", budgetData);

      // Update category's onTrack status
      await axios.patch(`api/v1/categories/${budgetData.category}`, {
        onTrack: true,
      });

      // Refresh categories
      const response = await axios.get("api/v1/categories");
      setCategories(response.data.data);
      setIsAddBudgetModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Categories
          </h1>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors shadow-md hover:shadow-lg"
            onClick={() => setIsAddCategoryModalOpen(true)}
          >
            <Plus size={18} className="mr-1" />
            Add Category
          </button>
        </div>

        <button
          onClick={handleGeneratePDF}
          className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
        >
          Download PDF
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onClick={() => openCategoryDetails(category)}
            />
          ))}
        </div>
      </div>

      <AddCategoryModal
        isOpen={isAddCategoryModalOpen}
        onClose={() => setIsAddCategoryModalOpen(false)}
        onAddCategory={handleAddCategory}
      />

      <CategoryDetailsModal
        isOpen={isCategoryDetailsOpen}
        onClose={() => setIsCategoryDetailsOpen(false)}
        category={selectedCategory}
        onAddBudgetClick={() => {
          setIsCategoryDetailsOpen(false);
          setIsAddBudgetModalOpen(true);
        }}
      />

      <AddBudgetModal
        isOpen={isAddBudgetModalOpen}
        onClose={() => setIsAddBudgetModalOpen(false)}
        category={selectedCategory}
        onAddBudget={handleAddBudget}
      />
    </div>
  );
};

export default CategoryPage;
