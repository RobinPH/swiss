function throwNewError() {
  raise "Error";
}

try {
  print("Executing...");
  throwNewError();
} catch {
  print("Something went wrong :(");
} finally {
  print("Done Executing");
}