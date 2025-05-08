import React, { useState, useEffect } from "react";
import { Plus, Search, X } from "lucide-react";
import axios from "axios";
import CategoryCard from "./CategoryCard";
import AddCategoryModal from "./AddCategoryModal";
import CategoryDetailsModal from "./CategoryDetailsModal";
import AddBudgetModal from "./AddBudgetModal";

axios.defaults.withCredentials = true;

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isCategoryDetailsOpen, setIsCategoryDetailsOpen] = useState(false);
  const [isAddBudgetModalOpen, setIsAddBudgetModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:8088/api/v1/categories");
        setCategories(response.data.data.categories);
        setFilteredCategories(response.data.data.categories);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Filter categories based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCategories(filtered);
    }
  }, [searchTerm, categories]);

  // Handle adding a new category
  const handleAddCategory = async (categoryData) => {
    try {
      const response = await axios.post("http://localhost:8088/api/v1/categories", categoryData);
      setCategories([...categories, response.data.data]);
      setIsAddCategoryModalOpen(false);
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
      // Add budget
      await axios.post("api/v1/budgets", budgetData);
      
      // Update category's onTrack status
      await axios.patch(`api/v1/categories/${budgetData.category}`, {
        onTrack: true
      });

      // Refresh categories
      const response = await axios.get("api/v1/categories");
      setCategories(response.data.data);
      setIsAddBudgetModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Categories</h1>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors shadow-md hover:shadow-lg"
              onClick={() => setIsAddCategoryModalOpen(true)}
            >
              <Plus size={18} className="mr-1" />
              Add Category
            </button>
          </div>
        </div>

        {filteredCategories.length === 0 ? (
          <div className="bg-white p-8 rounded-xl shadow-sm text-center border-2 border-dashed border-gray-200">
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "No categories match your search" 
                : "No categories found. Create your first category!"}
            </p>
            <button
              onClick={() => setIsAddCategoryModalOpen(true)}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              {searchTerm ? "Clear search" : "Add Category"}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category._id}
                category={category}
                onClick={() => openCategoryDetails(category)}
              />
            ))}
          </div>
        )}
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