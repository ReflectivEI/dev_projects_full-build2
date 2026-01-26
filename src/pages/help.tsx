import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Rocket,
  MessageSquare,
  Users,
  BookOpen,
  Layers,
  GraduationCap,
  BarChart,
  AlertCircle,
  Settings,
  ChevronRight,
  ArrowLeft,
} from "lucide-react";
import {
  HELP_CATEGORIES,
  HELP_ARTICLES,
  searchHelpArticles,
  getArticlesByCategory,
  getRelatedArticles,
  type HelpCategory,
  type HelpArticle,
} from "@/lib/help-content";

const ICON_MAP: Record<string, React.ElementType> = {
  Rocket,
  MessageSquare,
  Users,
  BookOpen,
  Layers,
  GraduationCap,
  BarChart,
  AlertCircle,
  Settings,
};

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<HelpCategory | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpArticle | null>(null);

  // Search results
  const searchResults = searchQuery.trim().length >= 2 ? searchHelpArticles(searchQuery) : [];

  // Category articles
  const categoryArticles = selectedCategory ? getArticlesByCategory(selectedCategory) : [];

  // Related articles
  const relatedArticles = selectedArticle ? getRelatedArticles(selectedArticle.id) : [];

  // Determine what to show
  const showSearch = searchQuery.trim().length >= 2;
  const showCategory = !showSearch && selectedCategory && !selectedArticle;
  const showArticle = !showSearch && selectedArticle;
  const showHome = !showSearch && !selectedCategory && !selectedArticle;

  const handleBack = () => {
    if (selectedArticle) {
      setSelectedArticle(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };

  const handleArticleClick = (article: HelpArticle) => {
    setSelectedArticle(article);
    setSearchQuery("");
  };

  const handleCategoryClick = (category: HelpCategory) => {
    setSelectedCategory(category);
    setSelectedArticle(null);
    setSearchQuery("");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            {(selectedCategory || selectedArticle) && (
              <Button variant="ghost" size="sm" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold">Help Center</h1>
              <p className="text-muted-foreground mt-1">
                Find answers, learn features, and troubleshoot issues
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for help... (e.g., 'how to use AI Coach', 'scores not updating')"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="container max-w-4xl mx-auto px-4 py-8">
          {/* HOME VIEW */}
          {showHome && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Browse by Category</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(HELP_CATEGORIES).map(([key, category]) => {
                    const Icon = ICON_MAP[category.icon] || Rocket;
                    return (
                      <Card
                        key={key}
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => handleCategoryClick(key as HelpCategory)}
                      >
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-primary/10">
                                <Icon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{category.name}</CardTitle>
                                <CardDescription className="mt-1">
                                  {category.description}
                                </CardDescription>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-muted-foreground" />
                          </div>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Popular Articles */}
              <div>
                <h2 className="text-2xl font-semibold mb-4">Popular Articles</h2>
                <div className="space-y-2">
                  {HELP_ARTICLES.slice(0, 5).map((article) => (
                    <Card
                      key={article.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleArticleClick(article)}
                    >
                      <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">{article.title}</CardTitle>
                            <Badge variant="secondary" className="mt-2">
                              {HELP_CATEGORIES[article.category].name}
                            </Badge>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SEARCH RESULTS */}
          {showSearch && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""} for "{searchQuery}"
              </h2>
              {searchResults.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium">No results found</p>
                    <p className="text-muted-foreground mt-2">
                      Try different keywords or browse categories above
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2">
                  {searchResults.map((article) => (
                    <Card
                      key={article.id}
                      className="cursor-pointer hover:border-primary transition-colors"
                      onClick={() => handleArticleClick(article)}
                    >
                      <CardHeader className="py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-base">{article.title}</CardTitle>
                            <Badge variant="secondary" className="mt-2">
                              {HELP_CATEGORIES[article.category].name}
                            </Badge>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* CATEGORY VIEW */}
          {showCategory && (
            <div>
              <div className="mb-6">
                <Badge variant="secondary" className="mb-2">
                  {HELP_CATEGORIES[selectedCategory].name}
                </Badge>
                <h2 className="text-2xl font-semibold">
                  {HELP_CATEGORIES[selectedCategory].description}
                </h2>
              </div>
              <div className="space-y-2">
                {categoryArticles.map((article) => (
                  <Card
                    key={article.id}
                    className="cursor-pointer hover:border-primary transition-colors"
                    onClick={() => handleArticleClick(article)}
                  >
                    <CardHeader className="py-4">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{article.title}</CardTitle>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* ARTICLE VIEW */}
          {showArticle && (
            <div>
              <div className="mb-6">
                <Badge variant="secondary" className="mb-2">
                  {HELP_CATEGORIES[selectedArticle.category].name}
                </Badge>
                <h2 className="text-3xl font-bold mb-4">{selectedArticle.title}</h2>
              </div>

              {/* Article Content */}
              <Card>
                <CardContent className="prose prose-sm max-w-none py-6">
                  <div
                    className="whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: selectedArticle.content
                        .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>')
                        .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold mt-5 mb-3">$1</h2>')
                        .replace(/^### (.+)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
                        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                        .replace(/^- (.+)$/gm, '<li class="ml-4">$1</li>')
                        .replace(/✅/g, '<span class="text-green-600">✅</span>')
                        .replace(/❌/g, '<span class="text-red-600">❌</span>'),
                    }}
                  />
                </CardContent>
              </Card>

              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
                  <div className="space-y-2">
                    {relatedArticles.map((article) => (
                      <Card
                        key={article.id}
                        className="cursor-pointer hover:border-primary transition-colors"
                        onClick={() => handleArticleClick(article)}
                      >
                        <CardHeader className="py-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-sm font-medium">{article.title}</CardTitle>
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
