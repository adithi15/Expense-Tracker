import expenses from "./api/expenses";

function App() {
  return (
    <div>
      <h2>Expenses</h2>
      {expenses.map((item) => (
        <div key={item.id}>
          <h4>{item.title}</h4>
          <p>₹{item.amount}</p>
          <p>{item.date}</p>
        </div>
      ))}
    </div>
  );
}

export default App;