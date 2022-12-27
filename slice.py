import trimesh
from shapely.geometry import LineString
import os.path
import matplotlib.pyplot as plt
from os import path
import numpy as np


while True: #get material thickness
    thickness = input("Enter material's thickness in model units: ")
    try:
        thickness = float(thickness)
        if thickness < 0:  # if not a positive int print message and ask for input again
            print("Sorry, thickness must be a positive number, try again")
            continue
        break
    except ValueError:
        print("That's not a number!")

while True: #get filepath
  filePath = input("Enter the filepath of the STL to slice: ")
  if filePath[-4:] != ".stl":
    print("Sorry it must be an STL file")
    continue
  if path.isfile(filePath):
    break
  else:
    print("That file doesn't exist!")

mesh = trimesh.load_mesh(filePath)
z_extents = mesh.bounds
z_levels  = np.arange(stop=z_extents[1][2],step=thickness) #slice the model
print(z_levels)
sections = mesh.section_multiplane(plane_origin=mesh.bounds[0], plane_normal=[0,0,1], heights=z_levels)
print(sections)
