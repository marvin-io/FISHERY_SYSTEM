import boat from '../assets/boat.jpg'
import castnet from '../assets/castnet.jpg'
import harvest from '../assets/harvest.jpg'

/**
 * The three field photos, laid out like the original collage:
 * one tall picture on the left, two stacked on the right with a slanted seam.
 */
export default function PhotoCollage({ className = '' }) {
  return (
    <div className={`collage ${className}`}>
      <figure className="c-boat">
        <img src={boat} alt="A fisherman mending his net on a bangka" />
      </figure>
      <div className="c-stack">
        <figure className="c-net">
          <img src={castnet} alt="Fishermen casting a net over calm water" />
        </figure>
        <figure className="c-harvest">
          <img src={harvest} alt="Farmers threshing rice below green hills" />
        </figure>
      </div>
    </div>
  )
}
