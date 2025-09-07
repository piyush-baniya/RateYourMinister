import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../supabaseClient";
import Spinner from "./Spinner";

const MinisterDetail = () => {
  const { ministerId } = useParams();
  const [minister, setMinister] = useState(null);
  const [wikiContent, setWikiContent] = useState("");
  const [wikiUrl, setWikiUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sanitizeWikiHtml = (htmlString) => {
    const doc = new DOMParser().parseFromString(htmlString, "text/html");

    // Remove elements that are not relevant for display
    const selectorsToRemove = [
      ".mw-editsection", // Edit links
      "sup.reference", // Reference numbers like [1], [2]
      ".noprint", // Elements not for printing
      'div[role="navigation"]', // Navigation boxes
      "#toc", // Table of Contents
      ".infobox", // The info box on the side
      ".thumb", // Image thumbnails in the article body
      ".mw-references-wrap", // The entire references section at the bottom
      ".reflist", // Also for references
    ];

    selectorsToRemove.forEach((selector) => {
      doc.querySelectorAll(selector).forEach((el) => el.remove());
    });

    // Modify all links to open in a new tab and point to the correct Wikipedia URL
    doc.querySelectorAll("a").forEach((a) => {
      const href = a.getAttribute("href");
      // Convert relative URLs (like /wiki/...) to absolute Wikipedia URLs
      if (href && href.startsWith("/")) {
        a.setAttribute("href", `https://en.wikipedia.org${href}`);
      }
      // Make all links open in a new tab
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferrer");
    });
    return doc.body.innerHTML;
  };

  useEffect(() => {
    const fetchMinisterData = async () => {
      setLoading(true);
      setError(null);

      // Fetch minister details from Supabase
      const { data: ministerData, error: ministerError } = await supabase
        .from("ministers_with_ratings")
        .select("*")
        .eq("id", ministerId)
        .single();

      if (ministerError || !ministerData) {
        setError("Could not fetch minister details.");
        setLoading(false);
        return;
      }
      setMinister(ministerData);

      // Fetch content from Wikipedia
      try {
        const findWikiPage = async (searchTerm) => {
          // Step 1: Search for the minister's name to find the correct page title
          const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
            searchTerm
          )}&format=json&origin=*`;
          const searchResponse = await fetch(searchUrl);
          if (!searchResponse.ok) return null;

          const searchData = await searchResponse.json();
          if (searchData.query.search.length === 0) return null;

          const pageTitle = searchData.query.search[0].title;

          // Step 2: Fetch the full page content using the correct page title
          const pageUrl = `https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(
            pageTitle
          )}&prop=text&formatversion=2&format=json&origin=*`;
          const pageResponse = await fetch(pageUrl);
          if (!pageResponse.ok) return null;

          return await pageResponse.json();
        };

        // Try fetching with just the name, then with name + position as a fallback
        let pageData = await findWikiPage(ministerData.name);
        if (!pageData) {
          pageData = await findWikiPage(
            `${ministerData.name} (${ministerData.position})`
          );
        }

        if (pageData && pageData.parse) {
          const sanitizedHtml = sanitizeWikiHtml(pageData.parse.text);
          setWikiContent(sanitizedHtml);
          setWikiUrl(`https://en.wikipedia.org/wiki/${pageData.parse.title}`);
        } else {
          throw new Error("Could not find a Wikipedia page for this minister.");
        }
      } catch (wikiError) {
        setWikiContent(
          `<p class="text-gray-400 italic">${wikiError.message}</p>`
        );
      }

      setLoading(false);
    };

    fetchMinisterData();
  }, [ministerId]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;
  if (!minister) return null;

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-10 rounded-2xl shadow-2xl border border-gray-700/50">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <img
            src={minister.photo_url || "https://via.placeholder.com/400x300"}
            alt={minister.name}
            className="w-full md:w-1/3 h-auto rounded-lg shadow-lg object-cover"
          />
          <div className="flex-grow">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
              {minister.name}
            </h1>
            <p className="text-lg text-indigo-400 mt-2">{minister.position}</p>
            <p className="text-md text-gray-400">{minister.party}</p>
          </div>
        </div>
        <div className="mt-8 prose prose-invert prose-p:text-gray-300 prose-a:text-indigo-400 hover:prose-a:text-indigo-300 max-w-none prose-headings:text-indigo-300 prose-headings:font-semibold prose-strong:text-gray-100 prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5">
          <h2 className="text-2xl font-bold text-white mb-4 border-b border-gray-700 pb-2">
            About (from Wikipedia)
          </h2>
          <div className="not-prose bg-yellow-900/20 border border-yellow-700/50 text-yellow-300 p-3 rounded-lg text-sm mb-4">
            <p className="!my-0">
              <strong>Disclaimer:</strong> This information is fetched directly
              from Wikipedia and may contain errors. Please recheck important
              details from official sources.
            </p>
          </div>
          <div dangerouslySetInnerHTML={{ __html: wikiContent }} />
          {wikiUrl && (
            <a
              href={wikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-sm"
            >
              Read more on Wikipedia &rarr;
            </a>
          )}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            &larr; Back to all ministers
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MinisterDetail;
