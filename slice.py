import trimesh
from shapely.geometry import LineString
import os.path
import matplotlib.pyplot as plt
from os import path
import numpy as np

while True: #get filepath
  filePath = input("Enter the filepath of the STL to slice: ")
  if filePath[-4:] != ".stl":
    print("Sorry it must be an STL file")
    continue
  if path.isfile(filePath):
    exportName = filePath[:-4] + ".svg"
    break
  else:
    print("That file doesn't exist!")

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

mesh = trimesh.load_mesh(filePath)
z_extents = mesh.bounds
z_levels  = np.arange(stop=z_extents[1][2],step=thickness) #slice the model
print(z_levels)
sections = mesh.section_multiplane(plane_origin=mesh.bounds[0], plane_normal=[0,0,1], heights=z_levels)
lastOffset = 0
lenSections = len(sections)
for i in range(lenSections):
  tempOffset = 0
  for j in sections[i].vertices:
    print(lastOffset)
    j[0] = j[0] + lastOffset
    if j[0]>tempOffset:
      tempOffset = j[0]
  lastOffset = tempOffset - (thickness * (i+1))
combined = np.sum(sections)
combined.show()
print("Your vector file has been saved as "+ exportName + ":)")