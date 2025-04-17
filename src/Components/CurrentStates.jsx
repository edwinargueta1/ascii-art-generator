export default function CurrentStates(props) {
    return (
        <div>
          <p>States for Debugging: </p>
        {Object.entries(props).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {String(value)}
          </div>
        ))}
      </div>
    );
  }
  