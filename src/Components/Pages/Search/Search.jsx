
import React, { useState } from "react";
import { Input } from "@/Components/ui/input";
import Button from "@/Components/ui/button";
import { SkeletonCard } from "@/Components/ui/SkeletonCard";
import UserProfileListItem from "@/Components/ui/Custom/UserProfileListItem";
import service from "../../../appwrite/config";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchAttempted, setSearchAttempted] = useState(false);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setSearching(true);
  setSearchAttempted(true);
    
    try {
      // Fetching user details based on search term
      const response = await service.searchUsers({
        name: searchTerm.trim(),
        limit: 50,
        offset: 0
      });
      const parsed = typeof response === 'string' ? JSON.parse(response) : response;
      const { users } = parsed;
      setUsers(users || []);
    } catch (error) {
      console.error("Error searching users:", error);
      setUsers([]);
    } finally {
      setSearching(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
  setSearchAttempted(false);
    setUsers([]); // Ensure users is empty
  };

  return (
    <div className="min-h-screen relative">
      {/* Enhanced background with animated gradient */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/40 via-blue-50/30 to-purple-50/40 dark:from-indigo-950/30 dark:via-blue-950/20 dark:to-purple-950/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent dark:from-gray-900/60" />
        {/* Animated search-themed background patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 dark:opacity-15">
          <div className="absolute top-32 left-16 w-64 h-64 bg-blue-400/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-20 right-20 w-80 h-80 bg-purple-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute bottom-32 left-1/2 w-72 h-72 bg-indigo-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '3s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-48 h-48 bg-cyan-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4.5s' }}></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-2 md:py-4">
        
        {/* Compact Search Header */}
        <div className="relative overflow-hidden mb-4 md:mb-6">
          {/* Background with glassmorphism */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-indigo-500/10 dark:from-purple-400/15 dark:via-blue-400/10 dark:to-indigo-400/15 backdrop-blur-xl"></div>
          <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm"></div>
          
          {/* Content */}
          <div className="relative border border-purple-200/40 dark:border-purple-700/40 rounded-lg md:rounded-xl shadow-xl p-3 md:p-4">
            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-500 rounded-t-lg md:rounded-t-xl"></div>
            
            <div className="text-center mb-3 md:mb-4">
              <h1 className="text-xl md:text-2xl font-bold mb-1 md:mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                � Find Users
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto">
                Discover and connect with community members
              </p>
            </div>

          {/* Compact Search Input */}
          <div className="mb-3 md:mb-4">
            <label className="block text-xs md:text-sm font-medium text-foreground mb-1 md:mb-2">
              Search Users
            </label>
            <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
              <div className="relative flex-1">
                <Input
                  type="text"
                  placeholder="Search by name, bio, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-purple-200/50 dark:border-purple-700/50 text-black dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-md md:rounded-lg p-2 md:p-3 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!searchTerm.trim() || searching}
                className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-md md:rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
              >
                {searching ? (
                  <div className="flex items-center gap-1 md:gap-2">
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-xs md:text-sm">Searching...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 md:gap-2">
                    <span className="text-xs md:text-sm">Search Users</span>
                  </div>
                )}
              </Button>
            </div>
          </div>

          {/* Compact Active Filters */}
          {searchTerm && (
            <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-blue-900/20 dark:to-purple-900/20 backdrop-blur-sm rounded-md md:rounded-lg p-2 md:p-3 border border-blue-200/30 dark:border-purple-700/30">
              <div className="flex flex-wrap gap-1 md:gap-2 items-center">
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  Searching:
                </span>
                {searchTerm && (
                  <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-2 py-1 rounded text-xs font-medium shadow-sm flex items-center gap-1">
                    "{searchTerm}"
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-xs font-medium px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-300"
                >
                  ✕ Clear
                </button>
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Compact Results */}
  {searchAttempted && (
          <div className="mb-3 md:mb-4">
            <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-lg border border-blue-200/20 dark:border-purple-800/20 rounded-md md:rounded-lg p-2 md:p-3 shadow-md">
              <p className="text-xs md:text-sm font-medium">
                {searching ? (
                  <span className="text-blue-600 dark:text-blue-400">
                    Searching for users...
                  </span>
                ) : (users && users.length > 0) ? (
                  <span className="text-green-600 dark:text-green-400">
                    Found {users.length} user{users.length !== 1 ? 's' : ''}
                  </span>
                ) : (
                  <span className="text-orange-600 dark:text-orange-400">
                    No users found
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        {/* Compact Users Grid */}
        {searching ? (
          <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-lg border border-blue-200/20 dark:border-purple-800/20 rounded-lg md:rounded-xl p-3 md:p-4 shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} className="bg-gradient-to-br from-blue-100/50 to-purple-100/50 dark:from-blue-900/30 dark:to-purple-900/30" />
              ))}
            </div>
          </div>
        ) : (
          searchAttempted && (
            <div className="bg-white/30 dark:bg-gray-900/30 backdrop-blur-lg border border-blue-200/15 dark:border-purple-800/15 rounded-lg md:rounded-xl p-3 md:p-4 shadow-md">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 md:gap-4">
                {(users && users.length > 0) ? (
                  users.map((user) => (
                    <div 
                      key={user?.$id || Math.random()}
                    >
                      <UserProfileListItem 
                        user={user}
                      />
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-6 md:py-8">
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-blue-200/30 dark:border-purple-800/30 rounded-lg md:rounded-xl p-4 md:p-6 max-w-sm mx-auto shadow-md">
                      <div className="text-4xl md:text-6xl mb-2 md:mb-4 opacity-50">�</div>
                      <h3 className="text-base md:text-lg font-bold text-foreground mb-2 md:mb-3">No users found</h3>
                      <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                        Try different keywords or check spelling
                      </p>
                      <div className="space-y-1 text-xs text-muted-foreground">
                        <p>• Use broader search terms</p>
                        <p>• Try partial names</p>
                        <p>• Check for typos</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Search;