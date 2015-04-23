def create_game_grid diff_level=0
  size = diff_level + 3
  puts "<div id='game_grid'>"
  for i in 1..size do
    puts "\t<div class='row' id='row#{i}'>\n"
    for j in 1..size do
      color = (i + j).is_even? ? 'light' : 'dark'
      puts "\t\t<div class='#{color}cell' id='#{i}-#{j}'></div>\n"
    end
    puts "\t</div>"
  end
  puts "</div>"
end

create_game_grid 3

