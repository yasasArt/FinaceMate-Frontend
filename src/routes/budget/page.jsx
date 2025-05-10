import React, { useState, useEffect } from "react";
import { Plus, Search, X, Filter } from "lucide-react";
import axios from "axios";
import CategoryCard from "./CategoryCard";
import AddCategoryModal from "./AddCategoryModal";
import CategoryDetailsModal from "./CategoryDetailsModal";
import AddBudgetModal from "./AddBudgetModal";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [typeFilter, setTypeFilter] = useState("all");
  const [showTypeFilter, setShowTypeFilter] = useState(false);

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

  // Filter categories based on search term and type
  useEffect(() => {
    let filtered = [...categories];

    // Apply search filter
    if (searchTerm.trim() !== "") {
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (category.description &&
            category.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply type filter
    if (typeFilter !== "all") {
      filtered = filtered.filter((category) => category.type === typeFilter);
    }

    setFilteredCategories(filtered);
  }, [searchTerm, typeFilter, categories]);

  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    doc.text("Categories Report", 14, 15);

    let y = 25;

    filteredCategories.forEach((cat) => {
      const line = `• Name: ${cat.name}, Description: ${cat.description || "N/A"}, Type: ${cat.type}, On Track: ${cat.onTrack ? "Yes" : "No"}`;
      doc.text(line, 14, y);
      y += 10;
    });

    doc.save("Budget-report.pdf");
  };

  const handleAddCategory = async (categoryData) => {
    try {
      const response = await axios.post(
        "http://localhost:8088/api/v1/categories",
        categoryData
      );
      setCategories([...categories, response.data.data]);
      setIsAddCategoryModalOpen(false);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  };

  const openCategoryDetails = (category) => {
    setSelectedCategory(category);
    setIsCategoryDetailsOpen(true);
  };

  const handleAddBudget = async (budgetData) => {
    try {
      window.location.reload();
      await axios.post("api/v1/budgets", budgetData);
      await axios.patch(`api/v1/categories/${budgetData.category}`, {
        onTrack: true
      });

      const response = await axios.get("api/v1/categories");
      setCategories(response.data.data);
      setIsAddBudgetModalOpen(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setTypeFilter("all");
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Categories</h1>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <button
              onClick={handleGeneratePDF}
              className="ml-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg"
            >
              Download PDF
            </button>

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

            <div className="relative">
              <button
                onClick={() => setShowTypeFilter(!showTypeFilter)}
                className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                <Filter size={18} />
                Filter
              </button>

              {showTypeFilter && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="p-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                    >
                      <option value="all">All Types</option>
                      <option value="income">Income</option>
                      <option value="expense">Expense</option>
                    </select>
                  </div>
                  <div className="border-t border-gray-200 px-2 py-2">
                    <button
                      onClick={resetFilters}
                      className="text-sm text-purple-600 hover:text-purple-800"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
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
              {searchTerm || typeFilter !== "all"
                ? "No categories match your filters"
                : "No categories found. Create your first category!"}
            </p>
            <button
              onClick={() => {
                if (searchTerm || typeFilter !== "all") {
                  resetFilters();
                } else {
                  setIsAddCategoryModalOpen(true);
                }
              }}
              className="text-purple-600 hover:text-purple-800 font-medium"
            >
              {searchTerm || typeFilter !== "all" ? "Clear filters" : "Add Category"}
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              Showing {filteredCategories.length} of {categories.length} categories
              {(searchTerm || typeFilter !== "all") && (
                <button
                  onClick={resetFilters}
                  className="ml-2 text-purple-600 hover:text-purple-800"
                >
                  Clear filters
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <CategoryCard
                  key={category._id}
                  category={category}
                  onClick={() => openCategoryDetails(category)}
                />
              ))}
            </div>
          </>
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