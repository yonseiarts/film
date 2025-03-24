
function selectItem(name) {
  document.getElementById('selectedItem').value = name;
  document.getElementById('selectedItem').scrollIntoView({ behavior: 'smooth' });
}
