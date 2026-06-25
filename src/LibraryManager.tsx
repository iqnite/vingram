export default function LibraryManager({
  libraryUrls,
  display = false,
  setLibraryUrls,
}: {
  libraryUrls: string[];
  display?: boolean;
  setLibraryUrls: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const addLibraryDialog = () => {
    const url = prompt("Enter the URL of the library JSON file:");
    if (!url) return;
    setLibraryUrls((prevUrls) => [...prevUrls, url]);
  };

  const removeLibrary = (url: string) => {
    const confirmRemoval = window.confirm(
      `Are you sure you want to remove the library: ${url}?`,
    );
    if (!confirmRemoval) return;
    setLibraryUrls((prevUrls) => prevUrls.filter((u) => u !== url));
  };

  return (
    <div
      style={{
        width: "100%",
        overflowY: "auto",
        display: display ? "block" : "none",
      }}
    >
      <div className="title">Libraries</div>
      <button onClick={addLibraryDialog}>Add Library</button>
      <div>
        <a
          href="/example-library.json"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "0.8em",
          }}
        >
          Example Library
        </a>
      </div>
      {libraryUrls.map((url, index) => (
        <div key={index} style={{ marginTop: "10px" }}>
          {url}{" "}
          {index != 0 ? (
            <button onClick={() => removeLibrary(url)}>Remove</button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
