import tkinter as tk

class GridWindow(tk.Frame):
    def __init__(self, master=None):
        super().__init__(master)
        self.master = master
        self.grid_cells = []
        self.selected_cell = None
        self.predefined_numbers = [-9, -8, -7, -1, 1, 7, 8, 9]
        self.create_widgets()

    def create_widgets(self):
        for row in range(8):
            grid_row = []
            for col in range(8):
                cell = tk.Label(self.master, text='', relief=tk.RIDGE, width=5, height=2)
                cell.grid(row=row, column=col, padx=1, pady=1)
                cell.bind("<Button-1>", self.cell_clicked)
                grid_row.append(cell)
            self.grid_cells.append(grid_row)

    def cell_clicked(self, event):
        clicked_cell = event.widget
        if self.selected_cell:
            self.selected_cell.config(bg='white', text='')
        self.selected_cell = clicked_cell
        clicked_cell.config(bg='red', text='x')
        self.update_grid()

    def update_grid(self):
        if self.selected_cell:
            selected_index = self.get_selected_indexes()[0] * 8 + self.get_selected_indexes()[1]
            for row in range(8):
                for col in range(8):
                    current_index = row * 8 + col
                    distance = current_index - selected_index
                    
                    if current_index == selected_index:
                        self.grid_cells[row][col].config(bg='red', text='x')
                    elif distance in self.predefined_numbers:
                        self.grid_cells[row][col].config(bg='yellow', text=str(distance))
                    else:
                        self.grid_cells[row][col].config(bg='white', text=str(distance))

    def get_selected_indexes(self):
        for row in range(8):
            for col in range(8):
                if self.grid_cells[row][col] == self.selected_cell:
                    return row, col

root = tk.Tk()
app = GridWindow(master=root)
app.mainloop()
