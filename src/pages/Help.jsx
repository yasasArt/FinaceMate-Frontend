import React, { useState } from "react";
import {
  HelpCircle,
  Search,
  BookOpen,
  Video,
  MessageCircle,
  Mail,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const HelpCenter = () => {
  const [activeSection, setActiveSection] = useState("faq");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const faqCategories = [
    {
      title: "Getting Started",
      items: [
        {
          question: "How do I create my first budget?",
          answer:
            'To create your first budget, go to the Budgets section and click "Add New Budget". Select a category, set your monthly budget amount, and track your spending.',
        },
        {
          question: "How can I link my bank accounts?",
          answer:
            'Navigate to Account Settings, select "Connect Bank", and follow the prompts to securely link your bank accounts using our encrypted connection.',
        },
      ],
    },
    {
      title: "Tracking Expenses",
      items: [
        {
          question: "How does expense tracking work?",
          answer:
            "MyFinance Mate automatically categorizes transactions from linked bank accounts. You can also manually add expenses in the Transactions section.",
        },
        {
          question: "Can I create custom expense categories?",
          answer:
            'Yes! Go to Settings > Categories and click "Add New Category" to create custom expense tracking categories tailored to your needs.',
        },
      ],
    },
  ];

  const supportResources = [
    {
      icon: <BookOpen className="text-purple-500" size={32} />,
      title: "User Guides",
      description: "Comprehensive guides to help you master MyFinance Mate",
      color: "purple",
    },
    {
      icon: <Video className="text-green-500" size={32} />,
      title: "Tutorial Videos",
      description: "Step-by-step video tutorials for easy learning",
      color: "green",
    },
    {
      icon: <MessageCircle className="text-blue-500" size={32} />,
      title: "Community Forum",
      description: "Connect with other users and share tips",
      color: "blue",
    },
  ];

  const contactMethods = [
    {
      icon: <Mail className="text-purple-500" size={32} />,
      title: "Email Support",
      contact: "support@myfinancemate.com",
      description: "Typical response time: 24-48 hours",
    },
    {
      icon: <MessageCircle className="text-green-500" size={32} />,
      title: "Live Chat",
      contact: "Available Mon-Fri, 9 AM - 5 PM",
      description: "Instant support during business hours",
    },
  ];

  const renderFAQSection = () => (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center mb-6 bg-gray-100 rounded-lg p-2">
        <Search className="text-gray-500 mr-3" size={20} />
        <input
          type="text"
          placeholder="Search frequently asked questions"
          className="w-full bg-transparent outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {faqCategories.map((category, catIndex) => (
        <div key={catIndex} className="mb-6">
          <h3 className="text-lg font-semibold mb-4">{category.title}</h3>
          {category.items
            .filter((item) =>
              item.question.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((item, index) => (
              <div key={index} className="border-b last:border-b-0 py-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() =>
                    setExpandedFAQ(
                      expandedFAQ === `${catIndex}-${index}`
                        ? null
                        : `${catIndex}-${index}`
                    )
                  }
                >
                  <h4 className="font-medium">{item.question}</h4>
                  {expandedFAQ === `${catIndex}-${index}` ? (
                    <ChevronUp className="text-purple-500" />
                  ) : (
                    <ChevronDown className="text-gray-500" />
                  )}
                </div>
                {expandedFAQ === `${catIndex}-${index}` && (
                  <p className="text-gray-600 mt-2">{item.answer}</p>
                )}
              </div>
            ))}
        </div>
      ))}
    </div>
  );

  const renderSupportResources = () => (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6">Support Resources</h2>
      <div className="grid md:grid-cols-3 gap-4">
        {supportResources.map((resource, index) => (
          <div
            key={index}
            className={`bg-${resource.color}-50 rounded-lg p-4 flex items-center hover:shadow-md transition`}
          >
            {resource.icon}
            <div className="ml-4">
              <h3 className="font-semibold">{resource.title}</h3>
              <p className="text-gray-600 text-sm">{resource.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContactSupport = () => (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6">Contact Support</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {contactMethods.map((method, index) => (
          <div
            key={index}
            className="bg-gray-50 rounded-lg p-4 flex items-center"
          >
            {method.icon}
            <div className="ml-4">
              <h3 className="font-semibold">{method.title}</h3>
              <p className="text-gray-600 text-sm">{method.contact}</p>
              <p className="text-gray-500 text-xs">{method.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <HelpCircle className="mr-3 text-purple-500" size={32} />
          <h1 className="text-2xl font-bold">Help Center</h1>
        </div>

        <div className="flex space-x-4 mb-6">
          {["FAQ", "Resources", "Contact Support"].map((section, index) => (
            <button
              key={section}
              onClick={() =>
                setActiveSection(["faq", "resources", "contact"][index])
              }
              className={`px-4 py-2 rounded-lg ${
                activeSection === ["faq", "resources", "contact"][index]
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {section}
            </button>
          ))}
        </div>

        {activeSection === "faq" && renderFAQSection()}
        {activeSection === "resources" && renderSupportResources()}
        {activeSection === "contact" && renderContactSupport()}
      </div>
    </div>
  );
};

export default HelpCenter;
